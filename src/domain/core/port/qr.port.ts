import type { TQR, TQRBundle } from '@/domain/core/dto/qr.dto';

export interface IQRPort {
  packBundle<T>(qr: TQR<T>): Promise<TQRBundle>;
  unpackBundle<T>(bundle: TQRBundle): Promise<TQR<T>>;
}
