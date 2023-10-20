import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Record, RecordDocument } from 'src/records/schemas/record.schema';
import { Role, User, UserDocument } from 'src/users/schemas/user.schema';

export enum Action {
  MANAGE = 'manage',
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export type AppAbility = Ability;

@Injectable()
export class AbilityFactory {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Record.name)
    private readonly recordModel: Model<RecordDocument>,
  ) {}

  defineAbility(user: User | null) {
    type Subjects =
      | InferSubjects<typeof this.userModel>
      | InferSubjects<typeof this.recordModel>
      | 'all';
    const { can, cannot, build } = new AbilityBuilder(
      Ability as AbilityClass<Ability<[Action, Subjects]>>,
    );

    const defineForAnon = () => {
      can(Action.READ, this.recordModel);
      can(Action.READ, this.userModel, ['_id', 'username', 'role']);
    };
    const defineForUser = () => {
      can(Action.READ, this.userModel, { _id: user._id });
      cannot(Action.READ, this.userModel, ['password']);
      can(
        Action.UPDATE,
        this.userModel,
        ['username', 'name', 'email', 'password'],
        {
          _id: user._id,
        },
      );
    };
    const defineForVerified = () => {
      can(Action.CREATE, this.recordModel);
      can(Action.DELETE, this.recordModel, { author: user._id });
      can(
        Action.UPDATE,
        this.recordModel,
        [
          'name',
          'description',
          'accessibility',
          'address',
          'lat',
          'lon',
          'type',
          'photos',
        ],
        {
          author: user._id,
        },
      );
      can(Action.READ, this.userModel, [
        'name',
        'email',
        'emailConfirmed',
        'createdAt',
      ]);
      // cannot(Action.CREATE, 'VerificationRequest');
    };
    const defineForModerator = () => {
      can(Action.READ, this.userModel, ['updatedAt']);
      can(Action.UPDATE, this.userModel, ['role'], { role: Role.USER });
    };
    const defineForAdmin = () => {
      can(Action.MANAGE, 'all');
    };

    switch (user?.role) {
      case Role.ADMIN:
        defineForAdmin();
        break;

      case Role.MODERATOR:
        defineForAnon();
        defineForUser();
        defineForVerified();
        defineForModerator();
        break;

      case Role.VERIFIED:
        defineForAnon();
        defineForUser();
        defineForVerified();
        break;

      case Role.USER:
        defineForAnon();
        defineForUser();
        break;

      default:
        defineForAnon();
        break;
    }

    return build({
      detectSubjectType: (object) =>
        object.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
