import path from "path";
import { collectFiles, safeReadFile } from "../security/validate";
import type { LaravelRouteInfo, LaravelFileInfo } from "../types/api";

export function extractRoutes(projectRoot: string): LaravelRouteInfo[] {
  const routes: LaravelRouteInfo[] = [];

  const apiContent = safeReadFile(projectRoot, "routes/api.php");
  if (apiContent) {
    routes.push(...parseRouteFile(apiContent, "api"));
  }

  const webContent = safeReadFile(projectRoot, "routes/web.php");
  if (webContent) {
    routes.push(...parseRouteFile(webContent, "web"));
  }

  // Scan route subdirectories (e.g., routes/backend/, routes/frontend/)
  const routeFiles = collectFiles(projectRoot, "routes", [".php"]);
  for (const file of routeFiles) {
    if (
      file.relativePath === "routes/api.php" ||
      file.relativePath === "routes/web.php"
    ) {
      continue;
    }
    const isApi = file.relativePath.includes("api");
    routes.push(...parseRouteFile(file.content, isApi ? "api" : "web"));
  }

  return routes;
}

function parseRouteFile(content: string, prefix: string): LaravelRouteInfo[] {
  const routes: LaravelRouteInfo[] = [];

  // Route::apiResource('products', ProductController::class)
  const resourcePattern =
    /\bRoute::apiResource\s*\(\s*['"]([^'"]+)['"]\s*,\s*['"]?([A-Z]\w+)(?:Controller)?['"]?::class\s*\)/g;
  let resMatch;
  while ((resMatch = resourcePattern.exec(content)) !== null) {
    const resource = resMatch[1];
    const controller = resMatch[2];
    const basePath = prefix === "api" ? `/api/${resource}` : `/${resource}`;
    const middleware = extractMiddleware(content, resMatch[0]);

    const resourceRoutes: Array<{ method: string; action: string; suffix: string }> = [
      { method: "GET", action: "index", suffix: "" },
      { method: "POST", action: "store", suffix: "" },
      { method: "GET", action: "show", suffix: "/{product}" },
      { method: "PUT", action: "update", suffix: "/{product}" },
      { method: "DELETE", action: "destroy", suffix: "/{product}" },
    ];

    for (const rr of resourceRoutes) {
      const uri = basePath + rr.suffix;
      routes.push({
        method: rr.method,
        uri,
        controller: `${controller}Controller`,
        action: rr.action,
        middleware,
        parameters: extractParameters(uri),
      });
    }
  }

  // Route::get/post/etc('path', 'Controller@method')
  const methodPattern =
    /\b(Route::|->)(get|post|put|patch|delete|options|any|match)\s*\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]/g;
  let match;

  while ((match = methodPattern.exec(content)) !== null) {
    const method = match[2].toUpperCase();
    const uri = prefix === "api" ? `/api${match[3]}` : match[3];
    const [controller, action] = match[4].split("@");
    const middleware = extractMiddleware(content, match[0]);
    const parameters = extractParameters(uri);

    routes.push({
      method,
      uri,
      controller: controller || "Unknown",
      action: action || "__invoke",
      middleware,
      parameters,
    });
  }

  // Route::get/post/etc('path', function() { ... }) or Route::get/post/etc('path', [Controller::class, 'method'])
  const closurePattern =
    /\bRoute::(get|post|put|patch|delete|options|any|match)\s*\(\s*['"]([^'"]+)['"]\s*,/g;
  let closureMatch;
  const seenUris = new Set(routes.map((r) => `${r.method}:${r.uri}`));

  while ((closureMatch = closurePattern.exec(content)) !== null) {
    const method = closureMatch[1].toUpperCase();
    const rawUri = closureMatch[2];
    const uri = prefix === "api" ? `/api${rawUri}` : rawUri;
    const key = `${method}:${uri}`;

    if (seenUris.has(key)) continue;
    seenUris.add(key);

    const middleware = extractMiddleware(content, closureMatch[0]);
    const parameters = extractParameters(uri);

    routes.push({
      method,
      uri,
      controller: "Closure",
      action: "__invoke",
      middleware,
      parameters,
    });
  }

  const groupPattern =
    /\bRoute::group\s*\(\s*\[[^\]]*\]\s*,\s*function\s*\(\)\s*\{([\s\S]*?)\}\s*\)/g;
  let groupMatch;
  while ((groupMatch = groupPattern.exec(content)) !== null) {
    const groupBody = groupMatch[1];
    const innerMethodPattern =
      /\b(get|post|put|patch|delete|options|any|match)\s*\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]/g;
    let innerMatch;
    while ((innerMatch = innerMethodPattern.exec(groupBody)) !== null) {
      const method = innerMatch[1].toUpperCase();
      const uri = prefix === "api" ? `/api${innerMatch[2]}` : innerMatch[2];
      const [controller, action] = innerMatch[3].split("@");
      const middleware = extractMiddleware(content, innerMatch[0]);
      const parameters = extractParameters(uri);

      routes.push({
        method,
        uri,
        controller: controller || "Unknown",
        action: action || "__invoke",
        middleware,
        parameters,
      });
    }
  }

  return routes;
}

function extractMiddleware(content: string, around: string): string[] {
  const idx = content.indexOf(around);
  if (idx === -1) return [];

  const preceding = content.substring(Math.max(0, idx - 500), idx);
  const middlewarePattern = /->middleware\s*\(\s*['"]([^'"]+)['"]/g;
  const middleware: string[] = [];
  let m;
  while ((m = middlewarePattern.exec(preceding)) !== null) {
    middleware.push(m[1]);
  }

  const groupMiddlewarePattern =
    /Route::group\s*\(\s*\[([^\]]*)\]/g;
  let gm;
  while ((gm = groupMiddlewarePattern.exec(preceding)) !== null) {
    const middlewareStr = gm[1];
    const authPattern = /['"]auth['"]/;
    if (authPattern.test(middlewareStr)) {
      middleware.push("auth");
    }
  }

  return [...new Set(middleware)];
}

function extractParameters(uri: string): string[] {
  const paramPattern = /\{(\w+)\}/g;
  const params: string[] = [];
  let m;
  while ((m = paramPattern.exec(uri)) !== null) {
    params.push(m[1]);
  }
  return params;
}

export function discoverControllers(
  projectRoot: string
): Map<string, LaravelFileInfo> {
  const controllers = new Map<string, LaravelFileInfo>();
  const files = collectFiles(projectRoot, "app/Http/Controllers");

  for (const file of files) {
    const basename = path.basename(file.relativePath, ".php");
    controllers.set(basename, {
      filePath: file.filePath,
      relativePath: file.relativePath,
      content: file.content,
    });
  }

  return controllers;
}

export function discoverRequests(projectRoot: string): Map<string, LaravelFileInfo> {
  const requests = new Map<string, LaravelFileInfo>();
  const files = collectFiles(projectRoot, "app/Http/Requests");

  for (const file of files) {
    const basename = path.basename(file.relativePath, ".php");
    requests.set(basename, {
      filePath: file.filePath,
      relativePath: file.relativePath,
      content: file.content,
    });
  }

  return requests;
}

export function discoverResources(projectRoot: string): Map<string, LaravelFileInfo> {
  const resources = new Map<string, LaravelFileInfo>();
  const files = collectFiles(projectRoot, "app/Http/Resources");

  for (const file of files) {
    const basename = path.basename(file.relativePath, ".php");
    resources.set(basename, {
      filePath: file.filePath,
      relativePath: file.relativePath,
      content: file.content,
    });
  }

  return resources;
}

export function discoverModels(projectRoot: string): Map<string, LaravelFileInfo> {
  const models = new Map<string, LaravelFileInfo>();
  const files = collectFiles(projectRoot, "app/Models");

  for (const file of files) {
    const basename = path.basename(file.relativePath, ".php");
    models.set(basename, {
      filePath: file.filePath,
      relativePath: file.relativePath,
      content: file.content,
    });
  }

  return models;
}

export function extractValidationRules(
  content: string
): Record<string, string> {
  const rules: Record<string, string> = {};

  // Match 'field' => 'rules' anywhere in the content
  const fieldPattern =
    /['"](\w+)['"]\s*=>\s*['"]([^'"]+)['"]/g;
  let fieldMatch;
  while ((fieldMatch = fieldPattern.exec(content)) !== null) {
    rules[fieldMatch[1]] = fieldMatch[2];
  }

  return rules;
}

export function extractResourceFields(
  content: string
): Record<string, string> {
  const fields: Record<string, string> = {};
  const fieldPattern =
    /['"](\w+)['"]\s*=>\s*\$this->(\w+)/g;
  let match;

  while ((match = fieldPattern.exec(content)) !== null) {
    fields[match[1]] = match[2];
  }

  return fields;
}

export function analyzeLaravelProject(projectRoot: string) {
  const routes = extractRoutes(projectRoot);
  const controllers = discoverControllers(projectRoot);
  const requests = discoverRequests(projectRoot);
  const resources = discoverResources(projectRoot);
  const models = discoverModels(projectRoot);

  const enrichedRoutes = routes.map((route) => {
    const controller = controllers.get(route.controller);
    const requestClass = requests.get(route.action);
    const validation = requestClass
      ? extractValidationRules(requestClass.content)
      : {};

    let authRequired = route.middleware.includes("auth");
    if (controller) {
      const authMiddleware = extractMiddleware(controller.content, "auth");
      if (authMiddleware.includes("auth")) authRequired = true;
    }

    return {
      ...route,
      validation,
      authRequired,
      controllerContent: controller?.content || null,
    };
  });

  return {
    routes: enrichedRoutes,
    controllers: Object.fromEntries(controllers),
    requests: Object.fromEntries(requests),
    resources: Object.fromEntries(resources),
    models: Object.fromEntries(models),
  };
}
