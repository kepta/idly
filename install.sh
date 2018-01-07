# #!/bin/bash

# #common
# cd ./packages/idly-common

# npm i
# npm unlink
# npm link

# #graph
# cd ../idly-graph

# npm i
# npm unlink
# npm link

# #osm
# cd ../idly-osm

# npm i
# npm unlink
# npm link

# ##LINKING
# #graph
# cd ../idly-graph

# npm i -S ../idly-common
# npm link idly-common

# ##LINKING
# #osm
# cd ../idly-osm
# npm i -S ../idly-common
# npm i -S ../idly-graph
# npm link idly-common
# npm link idly-graph

# ## main
# cd ../idly
# npm i
# npm i -S ../idly-common
# npm i -S ../idly-graph
# npm i -S ../idly-osm
# npm link idly-common
# npm link idly-graph
# npm link idly-osm