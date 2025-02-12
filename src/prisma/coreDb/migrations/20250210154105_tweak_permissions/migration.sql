/*
  Warnings:

  - You are about to drop the column `accessPermissions` on the `RolePermissions` table. All the data in the column will be lost.
  - You are about to drop the column `accessUsers` on the `RolePermissions` table. All the data in the column will be lost.
  - You are about to drop the `AppConfig` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `createdBy` on table `Users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedBy` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[RolePermissions] DROP CONSTRAINT [RolePermissions_accessPermissions_df];
ALTER TABLE [dbo].[RolePermissions] DROP CONSTRAINT [RolePermissions_accessUsers_df];
ALTER TABLE [dbo].[RolePermissions] DROP COLUMN [accessPermissions], [accessUsers];

ALTER TABLE [dbo].[RolePermissions] ADD [customers] INT NOT NULL CONSTRAINT [RolePermissions_customers_df] DEFAULT 0,
[rolePermissions] INT NOT NULL CONSTRAINT [RolePermissions_rolePermissions_df] DEFAULT 0,
[userAccounts] INT NOT NULL CONSTRAINT [RolePermissions_userAccounts_df] DEFAULT 0;

-- AlterTable
ALTER TABLE [dbo].[Users] ALTER COLUMN [createdBy] INT NOT NULL;
ALTER TABLE [dbo].[Users] ALTER COLUMN [updatedBy] INT NOT NULL;

-- DropTable
DROP TABLE [dbo].[AppConfig];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
