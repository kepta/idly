rm -r id-data
git clone --depth=1  https://github.com/openstreetmap/iD.git temp
cp -r temp/data id-data
rm -rf temp
