import { Avatar, type ButtonVariant, Card, Chip } from 'heroui-native';
import { View } from 'react-native';

import type { TCarer } from '@/domain/carer/entity/carer.entity';
import { CARER_TYPE_ENUM } from '@/domain/carer/enum/carer-type.enums';
import { STATUS_ENUM } from '@/domain/core/enum/status.enum';
import type { IconName } from '@/ui/components/atoms/icon.atom';
import { TextTranslation } from '@/ui/components/atoms/text-translations.atom';
import {
  TypographyParagraph,
  TypographyTitle,
} from '@/ui/components/atoms/typography.atom';
import { SettingsRow } from '@/ui/components/molecules/settings-row.molecule';
import type { Ti18nKeys } from '@/ui/i18n/locales/en-EN';

interface CarerCardOrganismProps {
  carer: TCarer;
  onInviteQR: () => void;
  onSync: () => void;
  onViewDetails: () => void;
  onDelete: () => void;
  testID: string;
}

export function CarerCardOrganism({
  carer,
  onInviteQR,
  onSync,
  onViewDetails,
  onDelete,
  testID,
}: CarerCardOrganismProps) {
  const getCarerTypeLabel = (type: CARER_TYPE_ENUM): Ti18nKeys => {
    switch (type) {
      case CARER_TYPE_ENUM.ADMIN:
        return 'page.carer-management.card.primary';
      case CARER_TYPE_ENUM.SECONDARY:
        return 'page.carer-management.card.secondary';
      case CARER_TYPE_ENUM.HEALTH:
        return 'page.carer-management.card.health';
      default:
        return 'page.carer-management.card.unknown';
    }
  };

  const getStatusLabel = (status: STATUS_ENUM): Ti18nKeys => {
    switch (status) {
      case STATUS_ENUM.ACTIVE:
        return 'page.carer-management.card.status-active';
      case STATUS_ENUM.INACTIVE:
        return 'page.carer-management.card.status-inactive';
      default:
        return 'page.carer-management.card.status-inactive';
    }
  };

  const initial = carer.name.charAt(0).toUpperCase();

  const buttonItems: Array<{
    id: string;
    onPress: () => void;
    title: Ti18nKeys;
    testID: string;
    icon: IconName;
    variant?: ButtonVariant;
    isVisible: boolean;
  }> = [
    {
      id: 'invite-qr',
      icon: 'qr-code',
      onPress: onInviteQR,
      title: 'page.carer-management.invite-button',
      testID: `${testID}.invite-qr.button`,
      isVisible: carer.type !== CARER_TYPE_ENUM.ADMIN,
    },
    {
      id: 'sync',
      icon: 'sync',
      onPress: onSync,
      title: 'page.carer-management.sync-button',
      isVisible: carer.type !== CARER_TYPE_ENUM.ADMIN,
      testID: `${testID}.sync.button`,
    },
    {
      id: 'view-details',
      icon: 'document-attach-outline',
      onPress: onViewDetails,
      isVisible: true,
      title: 'page.carer-management.detail-button',
      testID: `${testID}.view-details.button`,
    },
    {
      id: 'delete',
      icon: 'trash',
      onPress: onDelete,
      title: 'page.carer-management.delete-button',
      testID: `${testID}.delete.button`,
      isVisible: carer.type !== CARER_TYPE_ENUM.ADMIN,
      variant: 'danger-soft',
    },
  ];

  return (
    <Card testID={`${testID}.card`} className="rounded-lg light:bg-white gap-4">
      <View className="flex-row justify-between items-start">
        <View className="flex-row items-center gap-4">
          <Avatar size="md" alt="Large Avatar" variant="soft">
            <TextTranslation
              i18nKey="common.raw-value"
              values={{ value: initial }}
            />
          </Avatar>

          <View>
            <TypographyTitle
              size="lg"
              className="text-gray-900 dark:text-white leading-none mb-1"
              i18nKey="common.raw-value"
              testID={`${testID}.name`}
              values={{
                value: carer.name,
              }}
            />
            <TypographyParagraph
              size="xs"
              className="text-text-sub-light dark:text-text-sub-dark"
              i18nKey={getCarerTypeLabel(carer.type)}
              testID={`${testID}.type`}
            />
          </View>
        </View>
        <Chip size="md" variant="soft" color="success">
          <View className="size-1.5 mr-1.5 rounded-full bg-success" />
          <Chip.Label>
            <TextTranslation i18nKey={getStatusLabel(carer.status)} />
          </Chip.Label>
        </Chip>
      </View>

      <View className="gap-2">
        {buttonItems
          .filter((item) => item.isVisible)
          .map((item) => (
            <SettingsRow
              onPress={item.onPress}
              testID={item.testID}
              title={item.title}
              iconName={item.icon}
              key={`settings-row.${item.id}`}
            />
          ))}
      </View>
    </Card>
  );
}
