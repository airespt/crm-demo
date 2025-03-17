/*
  Warnings:

  - The primary key for the `VistaGroup` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Vistas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `vistaName` on the `Vistas` table. All the data in the column will be lost.
  - Added the required column `label` to the `Vistas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vistaId` to the `Vistas` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Vistas] DROP CONSTRAINT [Vistas_groupId_fkey];

-- AlterTable
ALTER TABLE [dbo].[VistaGroup] DROP CONSTRAINT [VistaGroup_pkey];
ALTER TABLE [dbo].[VistaGroup] ALTER COLUMN [groupId] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[VistaGroup] ADD CONSTRAINT VistaGroup_pkey PRIMARY KEY CLUSTERED ([groupId]);

-- AlterTable
ALTER TABLE [dbo].[Vistas] DROP CONSTRAINT [Vistas_pkey];
ALTER TABLE [dbo].[Vistas] ALTER COLUMN [groupId] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Vistas] DROP COLUMN [vistaName];
ALTER TABLE [dbo].[Vistas] ADD [label] NVARCHAR(50) NOT NULL, [vistaId] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Vistas] ADD CONSTRAINT Vistas_pkey PRIMARY KEY CLUSTERED ([groupId],[vistaId]);

-- AddForeignKey
ALTER TABLE [dbo].[Vistas] ADD CONSTRAINT [Vistas_groupId_fkey] FOREIGN KEY ([groupId]) REFERENCES [dbo].[VistaGroup]([groupId]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
