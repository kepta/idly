import area from '@turf/area';
import bboxClip from '@turf/bbox-clip';
import bboxPolygon from '@turf/bbox-polygon';
import { FeatureCollection } from '@turf/helpers';
import { BBox, mercator, Tile } from 'idly-common/lib/geo';
import parser from 'idly-faster-osm-parser';
import { Entity } from 'idly-common/lib/osm/structures';
const rsp =
  undefined &&
  `<?xml version="1.0" encoding="UTF-8"?>
<osm version="0.6" generator="CGImap 0.6.0 (14413 thorn-02.openstreetmap.org)" copyright="OpenStreetMap and contributors" attribution="http://www.openstreetmap.org/copyright" license="http://opendatacommons.org/licenses/odbl/1-0/">
 <bounds minlat="40.7587004" minlon="-73.9730072" maxlat="40.7592205" maxlon="-73.9723206"/>
 <node id="42432834" visible="true" version="11" changeset="56395675" timestamp="2018-02-15T20:18:49Z" user="ALE!" uid="40023" lat="40.7615712" lon="-73.9706553">
  <tag k="highway" v="traffic_signals"/>
 </node>
 <node id="42436701" visible="true" version="5" changeset="12113203" timestamp="2012-07-04T18:03:17Z" user="NJ Engineer" uid="703728" lat="40.7597393" lon="-73.9742235">
  <tag k="highway" v="traffic_signals"/>
 </node>
 <node id="42436703" visible="true" version="12" changeset="56395675" timestamp="2018-02-15T20:18:49Z" user="ALE!" uid="40023" lat="40.7590168" lon="-73.9725124">
  <tag k="highway" v="traffic_signals"/>
 </node>
 <node id="42436705" visible="true" version="5" changeset="15966137" timestamp="2013-05-03T21:26:12Z" user="Avi Flamholz" uid="753896" lat="40.7583747" lon="-73.9709918">
  <tag k="highway" v="traffic_signals"/>
 </node>
 <node id="42438886" visible="true" version="10" changeset="56395675" timestamp="2018-02-15T20:18:49Z" user="ALE!" uid="40023" lat="40.7565160" lon="-73.9743304">
  <tag k="highway" v="traffic_signals"/>
 </node>
 <node id="42440456" visible="true" version="11" changeset="56395675" timestamp="2018-02-15T20:18:49Z" user="ALE!" uid="40023" lat="40.7577641" lon="-73.9734231">
  <tag k="highway" v="traffic_signals"/>
 </node>
 <node id="42443613" visible="true" version="11" changeset="56395675" timestamp="2018-02-15T20:18:49Z" user="ALE!" uid="40023" lat="40.7609020" lon="-73.9711418">
  <tag k="highway" v="traffic_signals"/>
 </node>
 <node id="42448338" visible="true" version="11" changeset="56395675" timestamp="2018-02-15T20:18:49Z" user="ALE!" uid="40023" lat="40.7602692" lon="-73.9716019">
  <tag k="highway" v="traffic_signals"/>
 </node>
 <node id="42448811" visible="true" version="16" changeset="56395675" timestamp="2018-02-15T20:18:49Z" user="ALE!" uid="40023" lat="40.7558860" lon="-73.9747884">
  <tag k="highway" v="traffic_signals"/>
 </node>
 <node id="42452875" visible="true" version="12" changeset="56395675" timestamp="2018-02-15T20:18:49Z" user="ALE!" uid="40023" lat="40.7583874" lon="-73.9729700">
  <tag k="highway" v="traffic_signals"/>
 </node>
 <node id="42456611" visible="true" version="11" changeset="56395675" timestamp="2018-02-15T20:18:49Z" user="ALE!" uid="40023" lat="40.7596398" lon="-73.9720595">
  <tag k="highway" v="traffic_signals"/>
 </node>
 <node id="42457476" visible="true" version="13" changeset="56395675" timestamp="2018-02-15T20:18:49Z" user="ALE!" uid="40023" lat="40.7553500" lon="-73.9754495">
  <tag k="highway" v="traffic_signals"/>
 </node>
 <node id="42459098" visible="true" version="10" changeset="56395675" timestamp="2018-02-15T20:18:49Z" user="ALE!" uid="40023" lat="40.7571346" lon="-73.9738807">
  <tag k="highway" v="traffic_signals"/>
 </node>
 <node id="100522728" visible="true" version="10" changeset="56395675" timestamp="2018-02-15T20:18:49Z" user="ALE!" uid="40023" lat="40.7552643" lon="-73.9752404">
  <tag k="highway" v="traffic_signals"/>
 </node>
 <node id="100522741" visible="true" version="8" changeset="35410723" timestamp="2015-11-18T16:08:55Z" user="ALE!" uid="40023" lat="40.7546344" lon="-73.9756983">
  <tag k="highway" v="traffic_signals"/>
 </node>
 <node id="596775840" visible="true" version="4" changeset="35410723" timestamp="2015-11-18T16:08:55Z" user="ALE!" uid="40023" lat="40.7547208" lon="-73.9759070">
  <tag k="highway" v="traffic_signals"/>
 </node>
 <node id="596775867" visible="true" version="5" changeset="56395675" timestamp="2018-02-15T20:18:50Z" user="ALE!" uid="40023" lat="40.7566036" lon="-73.9745379">
  <tag k="highway" v="traffic_signals"/>
 </node>
 <node id="596775870" visible="true" version="5" changeset="56395675" timestamp="2018-02-15T20:18:50Z" user="ALE!" uid="40023" lat="40.7572227" lon="-73.9740877">
  <tag k="highway" v="traffic_signals"/>
 </node>
 <node id="596775876" visible="true" version="5" changeset="56395675" timestamp="2018-02-15T20:18:50Z" user="ALE!" uid="40023" lat="40.7578515" lon="-73.9736304">
  <tag k="highway" v="traffic_signals"/>
 </node>
 <node id="596775882" visible="true" version="5" changeset="56395675" timestamp="2018-02-15T20:18:50Z" user="ALE!" uid="40023" lat="40.7559730" lon="-73.9749965">
  <tag k="highway" v="traffic_signals"/>
 </node>
 <node id="596775900" visible="true" version="5" changeset="56395675" timestamp="2018-02-15T20:18:50Z" user="ALE!" uid="40023" lat="40.7591042" lon="-73.9727194">
  <tag k="highway" v="traffic_signals"/>
 </node>
 <node id="596775907" visible="true" version="6" changeset="56395675" timestamp="2018-02-15T20:18:50Z" user="ALE!" uid="40023" lat="40.7603565" lon="-73.9718087">
  <tag k="highway" v="traffic_signals"/>
 </node>
 <node id="596775914" visible="true" version="5" changeset="56395675" timestamp="2018-02-15T20:18:50Z" user="ALE!" uid="40023" lat="40.7584748" lon="-73.9731771">
  <tag k="highway" v="traffic_signals"/>
 </node>
 <node id="596775919" visible="true" version="5" changeset="56395675" timestamp="2018-02-15T20:18:50Z" user="ALE!" uid="40023" lat="40.7597270" lon="-73.9722665">
  <tag k="highway" v="traffic_signals"/>
 </node>
 <node id="596775935" visible="true" version="5" changeset="56395675" timestamp="2018-02-15T20:18:50Z" user="ALE!" uid="40023" lat="40.7616583" lon="-73.9708621">
  <tag k="highway" v="traffic_signals"/>
 </node>
 <node id="596775951" visible="true" version="5" changeset="56395675" timestamp="2018-02-15T20:18:50Z" user="ALE!" uid="40023" lat="40.7609893" lon="-73.9713485">
  <tag k="highway" v="traffic_signals"/>
 </node>
 <node id="1251582234" visible="true" version="4" changeset="35324063" timestamp="2015-11-15T10:16:06Z" user="robgeb" uid="336460" lat="40.7583471" lon="-73.9724421"/>
 <node id="1251582245" visible="true" version="4" changeset="35324063" timestamp="2015-11-15T10:16:06Z" user="robgeb" uid="336460" lat="40.7586868" lon="-73.9721939"/>
 <node id="1251582250" visible="true" version="4" changeset="35324063" timestamp="2015-11-15T10:16:06Z" user="robgeb" uid="336460" lat="40.7585733" lon="-73.9719231"/>
 <node id="1251582259" visible="true" version="4" changeset="35324063" timestamp="2015-11-15T10:16:06Z" user="robgeb" uid="336460" lat="40.7585025" lon="-73.9719748"/>
 <node id="1251582288" visible="true" version="4" changeset="35324063" timestamp="2015-11-15T10:16:06Z" user="robgeb" uid="336460" lat="40.7582595" lon="-73.9720379"/>
 <node id="1251582309" visible="true" version="4" changeset="35324063" timestamp="2015-11-15T10:16:06Z" user="robgeb" uid="336460" lat="40.7582972" lon="-73.9721279"/>
 <node id="1251582320" visible="true" version="4" changeset="35324063" timestamp="2015-11-15T10:16:06Z" user="robgeb" uid="336460" lat="40.7582346" lon="-73.9721736"/>
 <node id="1332514679" visible="true" version="5" changeset="23999775" timestamp="2014-07-07T09:31:46Z" user="robgeb" uid="336460" lat="40.7587247" lon="-73.9735539"/>
 <node id="1332514712" visible="true" version="5" changeset="23999775" timestamp="2014-07-07T09:31:46Z" user="robgeb" uid="336460" lat="40.7592083" lon="-73.9731993"/>
 <node id="1514506832" visible="true" version="4" changeset="23999775" timestamp="2014-07-07T09:31:46Z" user="robgeb" uid="336460" lat="40.7588946" lon="-73.9734287"/>
 <node id="1514506834" visible="true" version="4" changeset="23999775" timestamp="2014-07-07T09:31:46Z" user="robgeb" uid="336460" lat="40.7589472" lon="-73.9733910"/>
 <node id="1514506836" visible="true" version="4" changeset="23999775" timestamp="2014-07-07T09:31:46Z" user="robgeb" uid="336460" lat="40.7589940" lon="-73.9733563"/>
 <node id="1587561266" visible="true" version="2" changeset="35324063" timestamp="2015-11-15T10:16:06Z" user="robgeb" uid="336460" lat="40.7581311" lon="-73.9721317"/>
 <node id="1587561270" visible="true" version="3" changeset="35324063" timestamp="2015-11-15T10:16:06Z" user="robgeb" uid="336460" lat="40.7584659" lon="-73.9718875"/>
 <node id="1587561272" visible="true" version="2" changeset="35324063" timestamp="2015-11-15T10:16:07Z" user="robgeb" uid="336460" lat="40.7586012" lon="-73.9717887"/>
 <node id="2716012022" visible="true" version="1" changeset="21088995" timestamp="2014-03-13T20:32:16Z" user="Rub21_nycbuildings" uid="1781294" lat="40.7589656" lon="-73.9729763">
  <tag k="addr:housenumber" v="374"/>
  <tag k="addr:postcode" v="10022"/>
  <tag k="addr:street" v="Park Avenue"/>
 </node>
 <node id="2716012610" visible="true" version="1" changeset="21088995" timestamp="2014-03-13T20:32:30Z" user="Rub21_nycbuildings" uid="1781294" lat="40.7585893" lon="-73.9732345"/>
 <node id="2716012660" visible="true" version="1" changeset="21088995" timestamp="2014-03-13T20:32:31Z" user="Rub21_nycbuildings" uid="1781294" lat="40.7590792" lon="-73.9728753"/>
 <node id="2716012687" visible="true" version="1" changeset="21088995" timestamp="2014-03-13T20:32:31Z" user="Rub21_nycbuildings" uid="1781294" lat="40.7592146" lon="-73.9731947"/>
 <node id="2952220278" visible="true" version="1" changeset="23999775" timestamp="2014-07-07T10:16:53Z" user="robgeb" uid="336460" lat="40.7589353" lon="-73.9730114"/>
 <node id="2952220280" visible="true" version="1" changeset="23999775" timestamp="2014-07-07T10:16:53Z" user="robgeb" uid="336460" lat="40.7589729" lon="-73.9731002"/>
 <node id="2952220284" visible="true" version="1" changeset="23999775" timestamp="2014-07-07T10:16:53Z" user="robgeb" uid="336460" lat="40.7590677" lon="-73.9729136"/>
 <node id="2952220285" visible="true" version="1" changeset="23999775" timestamp="2014-07-07T10:16:53Z" user="robgeb" uid="336460" lat="40.7591053" lon="-73.9730023"/>
 <node id="3790180110" visible="true" version="4" changeset="56395675" timestamp="2018-02-15T20:18:50Z" user="ALE!" uid="40023" lat="40.7580579" lon="-73.9721890"/>
 <node id="3790180111" visible="true" version="2" changeset="56395675" timestamp="2018-02-15T20:18:50Z" user="ALE!" uid="40023" lat="40.7582931" lon="-73.9727464"/>
 <node id="3790180116" visible="true" version="1" changeset="34692040" timestamp="2015-10-17T11:41:26Z" user="robgeb" uid="336460" lat="40.7586732" lon="-73.9722689"/>
 <node id="3790180117" visible="true" version="3" changeset="56395675" timestamp="2018-02-15T20:18:50Z" user="ALE!" uid="40023" lat="40.7586848" lon="-73.9717261"/>
 <node id="3790180118" visible="true" version="1" changeset="34692040" timestamp="2015-10-17T11:41:26Z" user="robgeb" uid="336460" lat="40.7587598" lon="-73.9724871"/>
 <node id="3790180119" visible="true" version="1" changeset="34692040" timestamp="2015-10-17T11:41:26Z" user="robgeb" uid="336460" lat="40.7587800" lon="-73.9721949"/>
 <node id="3790180120" visible="true" version="1" changeset="34692040" timestamp="2015-10-17T11:41:26Z" user="robgeb" uid="336460" lat="40.7588667" lon="-73.9724132"/>
 <node id="3977886195" visible="true" version="2" changeset="56395675" timestamp="2018-02-15T20:18:50Z" user="ALE!" uid="40023" lat="40.7570924" lon="-73.9739114">
  <tag k="highway" v="crossing"/>
 </node>
 <node id="3977886197" visible="true" version="2" changeset="56395675" timestamp="2018-02-15T20:18:50Z" user="ALE!" uid="40023" lat="40.7571748" lon="-73.9741225">
  <tag k="highway" v="crossing"/>
 </node>
 <node id="3977886199" visible="true" version="2" changeset="56395675" timestamp="2018-02-15T20:18:49Z" user="ALE!" uid="40023" lat="40.7571979" lon="-73.9738348">
  <tag k="highway" v="crossing"/>
 </node>
 <node id="3977886201" visible="true" version="2" changeset="56395675" timestamp="2018-02-15T20:18:49Z" user="ALE!" uid="40023" lat="40.7572853" lon="-73.9740422">
  <tag k="highway" v="crossing"/>
 </node>
 <node id="3977886227" visible="true" version="2" changeset="56395675" timestamp="2018-02-15T20:18:49Z" user="ALE!" uid="40023" lat="40.7589638" lon="-73.9725509">
  <tag k="highway" v="crossing"/>
 </node>
 <node id="3977886228" visible="true" version="2" changeset="56395675" timestamp="2018-02-15T20:18:49Z" user="ALE!" uid="40023" lat="40.7590499" lon="-73.9727589">
  <tag k="highway" v="crossing"/>
 </node>
 <node id="3977886231" visible="true" version="2" changeset="56395675" timestamp="2018-02-15T20:18:50Z" user="ALE!" uid="40023" lat="40.7590838" lon="-73.9724637">
  <tag k="highway" v="crossing"/>
 </node>
 <node id="3977886235" visible="true" version="2" changeset="56395675" timestamp="2018-02-15T20:18:50Z" user="ALE!" uid="40023" lat="40.7591724" lon="-73.9726698">
  <tag k="highway" v="crossing"/>
 </node>
 <way id="109287832" visible="true" version="6" changeset="36897742" timestamp="2016-01-30T12:58:57Z" user="robgeb" uid="336460">
  <nd ref="1251582234"/>
  <nd ref="1251582245"/>
  <nd ref="1251582250"/>
  <nd ref="1251582259"/>
  <nd ref="1587561270"/>
  <nd ref="1587561272"/>
  <nd ref="3790180117"/>
  <nd ref="42436703"/>
  <nd ref="3977886227"/>
  <nd ref="42452875"/>
  <nd ref="3790180111"/>
  <nd ref="3790180110"/>
  <nd ref="1587561266"/>
  <nd ref="1251582288"/>
  <nd ref="1251582309"/>
  <nd ref="1251582320"/>
  <nd ref="1251582234"/>
 </way>
 <way id="266010411" visible="true" version="5" changeset="46621771" timestamp="2017-03-06T12:01:43Z" user="25or6to4" uid="37392">
  <nd ref="2716012687"/>
  <nd ref="2716012660"/>
  <nd ref="2716012610"/>
  <nd ref="1332514679"/>
  <nd ref="1514506832"/>
  <nd ref="1514506834"/>
  <nd ref="1514506836"/>
  <nd ref="1332514712"/>
  <nd ref="2716012687"/>
  <tag k="addr:city" v="New York"/>
  <tag k="addr:housenumber" v="370"/>
  <tag k="addr:postcode" v="10022"/>
  <tag k="addr:street" v="Park Avenue"/>
  <tag k="building" v="yes"/>
  <tag k="building:colour" v="#A9977F"/>
  <tag k="building:material" v="brick"/>
  <tag k="building:part" v="yes"/>
  <tag k="height" v="38"/>
  <tag k="leisure" v="sports_centre"/>
  <tag k="name" v="Racquet and Tennis Club"/>
  <tag k="nycdoitt:bin" v="1035713"/>
  <tag k="ref:nrhp" v="83001741"/>
  <tag k="roof:material" v="concrete"/>
  <tag k="roof:shape" v="flat"/>
  <tag k="sport" v="tennis"/>
  <tag k="start_date" v="1918"/>
  <tag k="wikidata" v="Q7279841"/>
  <tag k="wikipedia" v="en:Racquet and Tennis Club"/>
 </way>
 <way id="291732259" visible="true" version="2" changeset="36880220" timestamp="2016-01-29T14:14:45Z" user="robgeb" uid="336460">
  <nd ref="2952220280"/>
  <nd ref="2952220285"/>
  <nd ref="2952220284"/>
  <nd ref="2952220278"/>
  <nd ref="2952220280"/>
  <tag k="building:colour" v="#A9977F"/>
  <tag k="building:material" v="brick"/>
  <tag k="building:part" v="yes"/>
  <tag k="height" v="40"/>
  <tag k="min_height" v="38"/>
  <tag k="roof:colour" v="#A3A590"/>
  <tag k="roof:height" v="1.5"/>
  <tag k="roof:shape" v="hipped"/>
 </way>
 <way id="375673046" visible="true" version="1" changeset="34692040" timestamp="2015-10-17T11:41:26Z" user="robgeb" uid="336460">
  <nd ref="3790180120"/>
  <nd ref="3790180119"/>
  <nd ref="3790180116"/>
  <nd ref="3790180118"/>
  <nd ref="3790180120"/>
  <tag k="amenity" v="fountain"/>
  <tag k="landuse" v="basin"/>
 </way>
 <way id="458180192" visible="true" version="2" changeset="56395675" timestamp="2018-02-15T20:18:50Z" user="ALE!" uid="40023">
  <nd ref="42436705"/>
  <nd ref="3790180117"/>
  <nd ref="42436703"/>
  <nd ref="596775900"/>
  <nd ref="42436701"/>
  <tag k="hgv" v="destination"/>
  <tag k="highway" v="secondary"/>
  <tag k="name" v="East 53rd Street"/>
  <tag k="note" v="thru street"/>
  <tag k="oneway" v="yes"/>
  <tag k="tiger:cfcc" v="A41"/>
  <tag k="tiger:county" v="New York, NY"/>
  <tag k="tiger:name_base" v="53rd"/>
  <tag k="tiger:name_direction_prefix" v="E"/>
  <tag k="tiger:name_type" v="St"/>
 </way>
 <way id="497165753" visible="true" version="1" changeset="49133926" timestamp="2017-05-31T12:08:35Z" user="saikabhi" uid="3029661">
  <nd ref="596775935"/>
  <nd ref="596775951"/>
  <nd ref="596775907"/>
  <nd ref="596775919"/>
  <nd ref="3977886235"/>
  <nd ref="596775900"/>
  <nd ref="3977886228"/>
  <nd ref="596775914"/>
  <nd ref="596775876"/>
  <nd ref="3977886201"/>
  <nd ref="596775870"/>
  <nd ref="3977886197"/>
  <nd ref="596775867"/>
  <nd ref="596775882"/>
  <nd ref="42457476"/>
  <nd ref="596775840"/>
  <tag k="hgv" v="no"/>
  <tag k="highway" v="secondary"/>
  <tag k="name" v="Park Avenue"/>
  <tag k="oneway" v="yes"/>
  <tag k="wikidata" v="Q109711"/>
  <tag k="wikipedia" v="en:Park Avenue"/>
 </way>
 <way id="497165756" visible="true" version="1" changeset="49133926" timestamp="2017-05-31T12:08:35Z" user="saikabhi" uid="3029661">
  <nd ref="100522741"/>
  <nd ref="100522728"/>
  <nd ref="42448811"/>
  <nd ref="42438886"/>
  <nd ref="3977886195"/>
  <nd ref="42459098"/>
  <nd ref="3977886199"/>
  <nd ref="42440456"/>
  <nd ref="42452875"/>
  <nd ref="3977886227"/>
  <nd ref="42436703"/>
  <nd ref="3977886231"/>
  <nd ref="42456611"/>
  <nd ref="42448338"/>
  <nd ref="42443613"/>
  <nd ref="42432834"/>
  <tag k="hgv" v="no"/>
  <tag k="highway" v="secondary"/>
  <tag k="lanes" v="3"/>
  <tag k="name" v="Park Avenue"/>
  <tag k="oneway" v="yes"/>
  <tag k="tiger:cfcc" v="A41"/>
  <tag k="tiger:county" v="New York, NY"/>
  <tag k="tiger:name_base" v="Park"/>
  <tag k="tiger:name_type" v="Ave"/>
  <tag k="tiger:zip_left" v="10037"/>
  <tag k="tiger:zip_right" v="10035"/>
  <tag k="wikidata" v="Q109711"/>
  <tag k="wikipedia" v="en:Park Avenue"/>
 </way>
 <relation id="5594260" visible="true" version="1" changeset="34692040" timestamp="2015-10-17T11:41:26Z" user="robgeb" uid="336460">
  <member type="way" ref="109287832" role="outer"/>
  <member type="way" ref="375673046" role="inner"/>
  <member type="way" ref="375673047" role="inner"/>
  <tag k="highway" v="pedestrian"/>
  <tag k="name" v="Seagram Building Plaza"/>
  <tag k="type" v="multipolygon"/>
 </relation>
 <relation id="6247413" visible="true" version="3" changeset="44223590" timestamp="2016-12-07T00:52:27Z" user="zz_top" uid="4928856">
  <member type="way" ref="458180192" role="from"/>
  <member type="way" ref="420281339" role="to"/>
  <member type="node" ref="42436701" role="via"/>
  <tag k="restriction:conditional" v="no_right_turn @ (Mo-Fr 10:00-18:00)"/>
  <tag k="type" v="restriction"/>
 </relation>
 <relation id="7297408" visible="true" version="1" changeset="49133926" timestamp="2017-05-31T12:08:36Z" user="saikabhi" uid="3029661">
  <member type="way" ref="388696206" role="from"/>
  <member type="way" ref="497165753" role="to"/>
  <member type="node" ref="596775935" role="via"/>
  <tag k="restriction" v="no_right_turn"/>
  <tag k="type" v="restriction"/>
 </relation>
 <relation id="7297409" visible="true" version="1" changeset="49133926" timestamp="2017-05-31T12:08:36Z" user="saikabhi" uid="3029661">
  <member type="way" ref="46240204" role="to"/>
  <member type="node" ref="42432834" role="via"/>
  <member type="way" ref="497165754" role="from"/>
  <tag k="restriction" v="no_left_turn"/>
  <tag k="type" v="restriction"/>
 </relation>
</osm>
`;
export function addSource(layer: any, source: string) {
  return {
    ...layer,
    source,
    id: getNameSpacedLayerId(layer.id, source),
  };
}
export function getNameSpacedLayerId(layerId: string, source: string) {
  return source + '-' + layerId;
}

export function tilesFilterSmall(
  tiles: Tile[],
  viewportBbox: BBox,
  minimumOverlap: number
): Tile[] {
  const final = tiles
    .map(tile => {
      const tilePolygon = bboxPolygon(mercator.bbox(tile.x, tile.y, tile.z));
      const tileInsideBbox = bboxClip(tilePolygon, viewportBbox);

      const fractionVisible =
        area(tileInsideBbox) / area(bboxPolygon(viewportBbox));

      return { fractionVisible, tile };
    })
    .sort((a, b) => b.fractionVisible - a.fractionVisible)
    .reduce(
      (prev, { fractionVisible, tile }) => {
        if (prev.sum >= minimumOverlap) {
          return prev;
        }
        prev.tiles.push(tile);
        prev.sum += fractionVisible;

        return prev;
      },
      { sum: 0, tiles: [] as Tile[] }
    );
  console.log(
    'thresh',
    minimumOverlap,
    'orig',
    tiles.length,
    'removed',
    tiles.length - final.tiles.length
  );
  console.log(final);
  return final.tiles;
}

export function blankFC(): FeatureCollection<any, any> {
  return {
    type: 'FeatureCollection',
    features: [],
  };
}

const cache: any = new Map();

export async function fetchTileXml(
  x: number,
  y: number,
  zoom: number
): Promise<any> {
  // return parser(rsp);
  const bboxStr = mercator.bbox(x, y, zoom).join(',');
  if (cache.has(bboxStr)) {
    return cache.get(bboxStr);
  }
  const response = await fetch(
    `https://www.openstreetmap.org/api/0.6/map?bbox=${bboxStr}`
  );
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const entities = parser(rsp || (await response.text()));
  checkWay(entities);
  cache.set(bboxStr, entities);
  return entities;
}

export function bboxify(e: any, factor: number) {
  return [
    [e.point.x - factor, e.point.y - factor],
    [e.point.x + factor, e.point.y + factor],
  ];
}
export const hideVersion = (index?: string) =>
  index && modifiedIdParse(index)[0];

export const modifiedIdParse = (index: string) => index.split('#');

export const distance = (
  [x1, y1]: [number, number],
  [x2, y2]: [number, number]
) => Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));

export function tapLog<T>(fn: T) {
  if (typeof fn !== 'function') {
    console.log('Log-- expression', fn);
    return fn;
  }
  return (...args: any[]) => {
    console.log('Log-- input', ...args);
    const result = (fn as any).apply(null, args);
    console.log('Log-- output', result);
    return result;
  };
}

// RELATIONS DONT SUPPLY THE FULL THING WOW!
function checkWay(en: Entity[]) {
  var x: Map<string, Entity> = new Map();
  en.forEach(e => x.set(e.id, e));

  for (const [id, e] of x) {
    if (e.type === 'way') {
      e.nodes.forEach(r => {
        if (!x.has(r)) {
          throw new Error(` ${e.id} doesnt have ${r}`);
        }
      });
    }
  }
}
