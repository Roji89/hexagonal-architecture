import { NextFunction, Request, Response } from 'express';

// Express route handler parameter types
export interface RouteParams {
  req: Request;
  res: Response;
}

// For typed route parameters
export interface RouteParamsTyped<TParams = any, TQuery = any, TBody = any> {
  req: Request<TParams, any, TBody, TQuery>;
  res: Response;
}

// For middleware functions
export interface MiddlewareParams {
  req: Request;
  res: Response;
  next: NextFunction;
}

// Alternative shorter names (if you prefer)
export type ExpressRoute = RouteParams;
export type ExpressMiddleware = MiddlewareParams;

// Utility type for route handlers
export type RouteHandler = (params: RouteParams) => void | Promise<void>;
export type MiddlewareHandler = (params: MiddlewareParams) => void | Promise<void>;