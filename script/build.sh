echo "Initiate react building sequence.."
craco build --stats
echo "React build finish"
echo "Remove all source map from build folder"
echo "Removing.."
echo ./build/static/js/*.map 
rm ./build/static/js/*.map 