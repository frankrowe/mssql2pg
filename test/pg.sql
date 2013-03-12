create table public.testtable(
  id serial primary key not null,
  thing_id int not null,
  transport timestamp null,
  x varchar(50) null,
  y varchar(50) null
) ;