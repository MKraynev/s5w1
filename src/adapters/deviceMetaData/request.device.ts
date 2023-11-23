import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Request } from "express";
import { RequestDeviceMetaData } from "./entities/request.deviceMetaData.entity";

export const ReadRequestDeviceMetaData = createParamDecorator(
  async (data: any, ctx: ExecutionContext): Promise<RequestDeviceMetaData> => {
    const req = ctx.switchToHttp().getRequest() as Request & {
      rawHeaders: Array<string>;
    };

    const forwardedForHeader = req.headers['x-forwarded-for'] || req.headers['x-real-ip'];
    const clientIp = forwardedForHeader
      ? String(forwardedForHeader).split(',')[0].trim()
      : req.ip;

    const userAgentPos = req.rawHeaders.findIndex((header) => header === "User-Agent");
    const userAgent = req.rawHeaders[userAgentPos + 1];

    const device = new RequestDeviceMetaData(userAgent || "undefined", clientIp);

    return device;
  }
);