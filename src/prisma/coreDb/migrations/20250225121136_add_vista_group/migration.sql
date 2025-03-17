BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[VistaGroup] (
    [groupId] NVARCHAR(100) NOT NULL,
    [favouriteVista] NVARCHAR(1000) NOT NULL CONSTRAINT [VistaGroup_favouriteVista_df] DEFAULT '',
    CONSTRAINT [VistaGroup_pkey] PRIMARY KEY CLUSTERED ([groupId])
);

-- CreateTable
CREATE TABLE [dbo].[Vistas] (
    [groupId] NVARCHAR(100) NOT NULL,
    [vistaName] NVARCHAR(50) NOT NULL,
    [fields] NVARCHAR(4000) NOT NULL,
    CONSTRAINT [Vistas_pkey] PRIMARY KEY CLUSTERED ([groupId],[vistaName])
);

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
