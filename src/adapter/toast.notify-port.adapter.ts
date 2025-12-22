import Toast from 'react-native-toast-message';

import type {
  INotifyParams,
  INotifyPort,
} from '@/domain/core/port/notify.port';

// TODO: Remove and use HeroUI Native Toast from https://github.com/heroui-inc/heroui-native-example/blob/main/src/components/toast/use-shared-state.ts
export class ToastUINotifyPortAdapter implements INotifyPort {
  private showToast(
    type: 'success' | 'error' | 'info' | 'delete',
    params: INotifyParams
  ) {
    Toast.show({
      type,
      text1: params.title,
      text2: params.description,
      position: 'top',
      visibilityTime: 5000,
      autoHide: true,
      topOffset: 160,
    });
  }

  public loading(params: INotifyParams) {
    this.showToast('info', params);

    // // For loading, we can use info type with a loading indicator
    // Toast.show({
    //   type: 'info',
    //   text1: params.title,
    //   text2: params.description,
    //   position: 'bottom',
    //   visibilityTime: 0, // Don't auto-hide loading toasts
    //   autoHide: false,
    //   bottomOffset: 10,
    // });
  }

  public info(params: INotifyParams) {
    this.showToast('info', params);
  }

  public warning(params: INotifyParams) {
    // Warning can use error type with different styling
    this.showToast('error', params);
  }

  public error(params: INotifyParams) {
    this.showToast('error', params);
  }

  public success(params: INotifyParams) {
    this.showToast('success', params);
  }
}
