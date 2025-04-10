docker run \
  -e 'ACCEPT_EULA=Y' \
  -e 'MSSQL_SA_PASSWORD=localAdmin' \
  -e 'MSSQL_DATA_DIR=/coredb' \
  -v 'C:\Program Files\Microsoft SQL Server\MSSQL14.SQLEXPRESS\MSSQL\DATA:/coredb' \
  -p 1434:1433 \
  --name sqlCore \
  -d mcr.microsoft.com/mssql/server:2017-latest


  docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=localAdmin" -e "MSSQL_PID=Express" -v sqlCore:/var/opt/mssql -p 1434:1433 --name sqlExpress -d mcr.microsoft.com/mssql/server:2017-latest
