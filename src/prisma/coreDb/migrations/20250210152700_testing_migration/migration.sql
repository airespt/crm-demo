BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[AppConfig] (
    [id] NVARCHAR(1000) NOT NULL,
    [value] NVARCHAR(4000) NOT NULL,
    CONSTRAINT [AppConfig_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Users] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL CONSTRAINT [Users_password_df] DEFAULT '',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Users_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [createdBy] NVARCHAR(1000),
    [updatedAt] DATETIME2 CONSTRAINT [Users_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedBy] NVARCHAR(1000),
    [roleId] INT NOT NULL,
    CONSTRAINT [Users_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Users_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[RolePermissions] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [accessUsers] INT NOT NULL CONSTRAINT [RolePermissions_accessUsers_df] DEFAULT 0,
    [accessPermissions] INT NOT NULL CONSTRAINT [RolePermissions_accessPermissions_df] DEFAULT 0,
    CONSTRAINT [RolePermissions_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [RolePermissions_name_key] UNIQUE NONCLUSTERED ([name])
);

-- AddForeignKey
ALTER TABLE [dbo].[Users] ADD CONSTRAINT [Users_roleId_fkey] FOREIGN KEY ([roleId]) REFERENCES [dbo].[RolePermissions]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
