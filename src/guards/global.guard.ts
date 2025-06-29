import { CanActivate, ExecutionContext, Injectable, mixin, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

export function AnyAuthGuard(...guards: Type<CanActivate>[]): Type<CanActivate> {
  @Injectable()
  class MixinAnyAuthGuard implements CanActivate {
    constructor(private readonly moduleRef: ModuleRef) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      for (const guardType of guards) {
        const guard = this.moduleRef.get(guardType, { strict: false });
        if (!guard) continue;
try {
        const result = guard.canActivate(context);
        const passed = result instanceof Promise ? await result : result;

        if (passed === true) {
          return true; // Allow if at least one guard passes
        }}catch {
          continue
        }
      }

      return false; // Deny if all guards fail
    }
  }

  return mixin(MixinAnyAuthGuard);
}