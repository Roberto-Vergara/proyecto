import { User } from "src/user/schema/user.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";


@Entity("product")
export class Product extends BaseEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @Column()
    imageUrl: string;//come from cloudinary response

    @ManyToOne(type => User, user => user.products)
    @JoinColumn({ name: "user_id" })
    user: User;
}