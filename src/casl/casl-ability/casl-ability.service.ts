import { AbilityBuilder, PureAbility } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { Injectable, Scope } from '@nestjs/common';
import { Post, Role, User } from '@prisma/client';

//rbac - role based access control
//abac - attribute based access control
//acl - access control list

export type PermissionActions = 'manage' | 'read' | 'create' | 'update' | 'delete';

export type PermissionResource = Subjects<{ User: User; Post: Post }> | 'all';

export type AppAbility = PureAbility<
    [PermissionActions, PermissionResource], 
    PrismaQuery
>;

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
        can('read', 'Post', { authorId: user.id });
        can('create', 'Post');
        can('update', 'Post' );
    },
    READER: (user, { can }) => {
        can('read', 'Post', { published: true });
    }
}

@Injectable({scope: Scope.REQUEST})
export class CaslAbilityService {
    ability: AppAbility;

    createForUser(user: User) {
        const builder = new AbilityBuilder<AppAbility>(createPrismaAbility);
        rolePermissionsMap[user.role](user, builder);
        this.ability = builder.build();

        return this.ability;
    }
}
