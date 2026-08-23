import { z } from "zod";

export const ParameterSchema = z.object({
  name: z.string(),
  in: z.enum(["path", "query", "header", "cookie"]),
  required: z.boolean().optional(),
  description: z.string().optional(),
  schema: z
    .object({
      type: z.string().optional(),
    })
    .optional(),
});

export const RequestBodySchema = z.object({
  description: z.string().optional(),
  required: z.boolean().optional(),
  content: z
    .record(
      z.string(),
      z.object({
        schema: z.record(z.unknown()).optional(),
        example: z.unknown().optional(),
      })
    )
    .optional(),
});

export const ResponseSchema = z.object({
  statusCode: z.number(),
  description: z.string(),
  content: z
    .record(
      z.string(),
      z.object({
        schema: z.record(z.unknown()).optional(),
        example: z.unknown().optional(),
      })
    )
    .optional(),
});

export const EndpointSchema = z.object({
  method: z.string(),
  path: z.string(),
  summary: z.string().optional(),
  description: z.string().optional(),
  operationId: z.string().optional(),
  authentication: z.array(z.string()).optional(),
  parameters: z.array(ParameterSchema).optional(),
  requestBody: RequestBodySchema.nullish(),
  responses: z.array(ResponseSchema).optional(),
  tags: z.array(z.string()).optional(),
});

export const ApiInfoSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  version: z.string().optional(),
});

export const AnalyzedApiSchema = z.object({
  info: ApiInfoSchema,
  servers: z
    .array(
      z.object({
        url: z.string(),
        description: z.string().optional(),
      })
    )
    .optional(),
  endpoints: z.array(EndpointSchema),
});

export type Parameter = z.infer<typeof ParameterSchema>;
export type RequestBody = z.infer<typeof RequestBodySchema>;
export type Response = z.infer<typeof ResponseSchema>;
export type Endpoint = z.infer<typeof EndpointSchema>;
export type ApiInfo = z.infer<typeof ApiInfoSchema>;
export type AnalyzedApi = z.infer<typeof AnalyzedApiSchema>;

export interface LaravelRouteInfo {
  method: string;
  uri: string;
  controller: string;
  action: string;
  middleware: string[];
  parameters: string[];
}

export interface LaravelFileInfo {
  filePath: string;
  relativePath: string;
  content: string;
}

export interface EnrichedRoute extends LaravelRouteInfo {
  validation: Record<string, string>;
  authRequired: boolean;
  controllerContent: string | null;
}
