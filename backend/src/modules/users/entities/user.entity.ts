import { Entity } from 'src/common/domain/entities/base.entity';

export type TUserProps = {
    id: string;
    email: string;
    passwordHash: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
};

export class UserEntity extends Entity<TUserProps> {
    private constructor(props: TUserProps) {
        super(props);
    }

    static create(props: TUserProps): UserEntity {
        if (!props.email.trim()) {
            throw new Error('Email is required');
        }

        if (!props.name.trim()) {
            throw new Error('Name is required');
        }

        //create object
        return new UserEntity({
            ...props,
            email: props.email.trim().toLowerCase(),
            name: props.name.trim(),
        });
    }

    get email(): string {
        return this.props.email;
    }

    get passwordHash(): string {
        return this.props.passwordHash;
    }

    get name(): string {
        return this.props.name;
    }
}