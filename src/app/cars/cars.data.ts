export class CarsEntity{
  carName: string;
  carDesc: string;
  carImageUrl: string;
  comments: string;
  id: string;
}

export class UserComment{
  UserId: string;
  comment:string;
  IsLiked: boolean;
}
