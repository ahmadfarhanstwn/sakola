import { WaitingApprovalEntity } from '../../../waiting_approval/entity/waiting_approval.entity';

export const waitingApprovalStub = (): WaitingApprovalEntity => {
  return {
    id: 9328398932,
    classroom_id: 9384949343,
    user_id: 7478374929,
    joined_date: new Date(),
  };
};
