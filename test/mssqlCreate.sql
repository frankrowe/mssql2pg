CREATE TABLE [dbo].[TestTable](
  [ID] [int] IDENTITY(1,1) NOT NULL,
  [THING_ID] [int] NOT NULL,
  [Transport] [datetime] NULL,
  [X] [nvarchar](50) NULL,
  [Y] [nvarchar](50) NULL
) ON [PRIMARY]