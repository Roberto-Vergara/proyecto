import { Product } from "src/product/schema/product.entity";
import { Entity, Column, PrimaryColumn, BaseEntity, OneToMany } from "typeorm";



@Entity("user")
export class User extends BaseEntity {

    @PrimaryColumn()
    id: string; //uuid

    @Column()
    name: string;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column()
    money: number;

    @OneToMany(type => Product, product => product.user)
    products: Product[];
}