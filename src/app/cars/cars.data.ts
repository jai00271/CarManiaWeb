export class CarsEntity{
  carName: string;
  carDesc: string;
  carImageUrl: string;
  //comments: UserComment[];
  id: string;
}

export class UserComment{
  userId: string;
  carId: string
  comment:Array<string>;
  isLike: boolean;
  id:string;
  username: string;
}

export class UserNameWithComment{
  username: string;
  comment:string;
  commentedDate:string;
}
