import { TabStatus } from '@utilities/app-enum';

export const AdvancePaymentPassTabList = [
  {
    label: 'label.pending_approval',
    icon: 'pi pi-clock',
    value: TabStatus.Pending,
  },
  {
    label: 'label.approved',
    icon: 'pi pi-check-circle',
    value: TabStatus.Approved,
  },
  {
    label: 'label.all',
    icon: 'pi pi-th-large',
    value: TabStatus.All,
  },
];
