import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm"

export class CommonEntity {

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date
}
