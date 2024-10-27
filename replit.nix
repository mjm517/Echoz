{pkgs}: {
  deps = [
    pkgs.geos
    pkgs.postgis
    pkgs.openssl
    pkgs.postgresql
  ];
}
