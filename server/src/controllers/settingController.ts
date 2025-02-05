import { Request, Response } from 'express';
import { SettingService } from '../services/setting';

export class SettingController {
  static async getSetting(req: Request, res: Response) {
    try {
      const setting = await SettingService.getSetting(req.user?._id);
      return res.status(200).json({
        status: 'success',
        message: 'Setting fetched successfully',
        data: {
          setting,
        },
      });
    } catch (error: any) {
      return res.status(401).json({
        status: 'error',
        message: error.message,
      })
    }
  }

  static async updateSetting(req: any, res: Response) {
    try {
      const setting = await SettingService.updateSetting(req.user._id, req.body);
      return res.status(200).json({
        status: 'success',
        message: 'Setting updated successfully',
        data: {
          setting,
        },
      });
    } catch (error: any) {
      console.log(error)
      return res.status(401).json({
        status: 'error',
        message: error.message,
      })
    }
  }
}

