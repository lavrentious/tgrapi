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

// export type Subjects =
//   | InferSubjects<typeof User>
//   | InferSubjects<typeof Record>
//   | 'all';
export type AppAbility = Ability;

@Injectable()
export class AbilityFactory {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Record.name)
    private readonly recordModel: Model<RecordDocument>,
  ) {}

  defineAbility(user: UserDocument | null) {
    type Subjects =
      | InferSubjects<typeof this.userModel>
      | InferSubjects<typeof this.recordModel>
      | 'all';
    const { can, build } = new AbilityBuilder(
      Ability as AbilityClass<Ability<[Action, Subjects]>>,
    );

    const defineForAnon = () => {
      can(Action.READ, this.recordModel);
      can(Action.READ, this.userModel, ['username', 'name', 'role']);
    };
    const defineForUser = () => {
      can(Action.READ, this.userModel, { _id: user._id });
      can(
        Action.UPDATE,
        this.userModel,
        ['username', 'name', 'email', 'password'],
        {
          _id: user._id,
        },
      );
      if (user.emailConfirmed) {
        // can(Action.CREATE, 'VerificationRequest');
        // can([Action.DELETE, Action.READ], 'VerificationRequest', { userId: user._id });
      }
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
      can(Action.READ, this.userModel, ['createdAt']);
      // cannot(Action.CREATE, 'VerificationRequest');
    };
    const defineForModerator = () => {
      can(Action.READ, this.userModel);
      can(Action.UPDATE, this.userModel, ['role'], { role: Role.USER });
      // can([Action.READ, Action.DELETE], 'VerificationRequest');
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
