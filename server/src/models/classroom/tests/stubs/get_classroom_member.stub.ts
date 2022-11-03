import { ClassMemberRoleEnum } from '../../../class_members/entity/class_members.entity';

export const getClassroomMemberStub = () => {
  return {
    role: ClassMemberRoleEnum.Student,
    id: 98382398392,
    full_name: 'Joko Widodo',
    photo_profile: 'jokowiselfie.png',
  };
};
