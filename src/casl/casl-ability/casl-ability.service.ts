import { AbilityBuilder, PureAbility } from '@casl/ability';
import { Subjects } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { Post, Role, User } from '@prisma/client';

export type PermissionActions = 'manage' | 'read' | 'create' | 'update' | 'delete';

export type PermissionResource = Subjects<{ User: User; Post: Post }> | 'all';

export type AppAbility = PureAbility<[PermissionActions, PermissionResource]>;

export type DefinePermissions = (
    user: User,
    builder: AbilityBuilder<AppAbility>,
) => void;

const rolePermissionsMap: Record<Role, DefinePermissions> = {
    ADMIN: (user, { can }) => {
        can('manage', 'all');
    },
    EDITOR: (user, { can }) => {
        can('read', 'Post');
        can('update', 'Post');
        can('create', 'Post');
    },
    WRITER: (user, { can }) => {
        can('read', 'Post');
        can('create', 'Post');
        can('update', 'Post');
    },
    READER: (user, { can }) => {
        can('read', 'Post');
    }
}

@Injectable()
export class CaslAbilityService {}
