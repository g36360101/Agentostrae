import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class HealthController {
  @Get()
  check() {
    return {
      success: true,
      data: {
        status: "ok",
        service: "agentos-api",
        timestamp: new Date().toISOString(),
      },
    } as const;
  }
}
