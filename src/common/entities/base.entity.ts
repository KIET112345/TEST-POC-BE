import {
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @Column({ nullable: true })
  createdBy?: string;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @Column({ nullable: true })
  updatedBy?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isDelete: boolean;

  @BeforeInsert()
  setCreatedAt() {
    this.createdAt = new Date();
  }

  // @BeforeUpdate()
  // setUpdatedAt() {
  //   this.updatedAt = new Date();
  // }

  @BeforeInsert()
  setCreatedBy() {
    this.createdBy = 'system';
  }

  @BeforeUpdate()
  setUpdatedBy() {
    this.updatedBy = 'system';
  }
}
