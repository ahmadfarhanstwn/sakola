import { ClassroomEntity, PostSetting } from '../../entity/classroom.entity';

export const classroomStub = (): ClassroomEntity => {
  return {
    id: 783273827332,
    name: 'Kelas Jokowi',
    description: 'Kelasnya Pak Jokowi',
    join_approval: true,
    post_setting: PostSetting.AllPostComment,
    members_count: 1,
    created_at: new Date(),
    updated_at: new Date(),
  };
};
