import { classroomStub } from '../tests/stubs/classroom.stub';
import { getClassroomMemberStub } from '../tests/stubs/get_classroom_member.stub';
import { waitingApprovalStub } from '../tests/stubs/waiting_approval.stub';

export const classroomService = jest.fn().mockReturnValue({
  createClassroom: jest.fn().mockResolvedValue(classroomStub()),
  joinClassroom: jest.fn().mockResolvedValue(true),
  acceptJoin: jest.fn().mockResolvedValue(true),
  rejectJoin: jest.fn().mockResolvedValue(true),
  getWaitingApprovals: jest.fn().mockResolvedValue(waitingApprovalStub),
  removeMember: jest.fn().mockResolvedValue(true),
  deleteClassroom: jest.fn().mockResolvedValue(true),
  getClassroomMembers: jest.fn().mockResolvedValue([getClassroomMemberStub()]),
});
