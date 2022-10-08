import { IsUUID, IsNotEmpty } from 'class-validator';

export class deleteMessageDto {
  @IsUUID()
  @IsNotEmpty({ message: 'id field cannot be empty' })
  id: number;

  @IsUUID()
  @IsNotEmpty({ message: 'user_id field cannot be empty' })
  user_id: number;

  @IsUUID()
  @IsNotEmpty({ message: 'classroom_id field cannot be empty' })
  classroom_id: number;
}

export class sendMessageDto {
  @IsNotEmpty({ message: 'content message field cannot be empty' })
  message: string;

  @IsUUID()
  @IsNotEmpty({ message: 'classroom_id field cannot be empty' })
  classroom_id: number;
}
