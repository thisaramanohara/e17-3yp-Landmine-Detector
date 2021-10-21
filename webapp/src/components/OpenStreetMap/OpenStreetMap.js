import { geolocated } from "react-geolocated";
import { MapContainer, Popup, TileLayer, Marker, Circle, MapConsumer, useMapEvent } from 'react-leaflet'
import './OpenStreetMap.css'

/********************* */
import React, {useState, useEffect} from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import { getSearch, listSearches } from '../../graphql/queries';
import { createSearch, updateSearch , deleteSearch } from '../../graphql/mutations';
import Amplify, {API, graphqlOperation} from 'aws-amplify';
import config from '../../aws-exports';
import { BrowserRouter, Link, Route } from "react-router-dom";
import Proceed from "../Proceed/Proceed";

const initialFormState = { id:'akila154', RobotID: '#0001', UserID: 'akila154-1', name: 'akila+R12+01:09:55', description: '', searchLat: 6.0513, searchLon: 80.2405, startLot: 34.342, startLon: 23.345, LocationData: {Lat: 24.233 , Lon: 23.234, Elev:0.0, isMine:false, isObs:false,isClear:true}, PathData: {Lat: 24.233 , Lon: 23.234, Elev:0.0, isMine:false, isObs:false,isClear:true}}

Amplify.configure(config);













function CallMap(lat ,lan, rad) {

  console.log('main point is '+lat+' '+lan);

  // createCoodinatesArray(6.0512, 80.2405, rad);


  console.log('rad is '+rad);
    return(
        <MapContainer center={[lat, lan]} zoom={20}>
            {console.log('hey '+lat+' '+lan)}

            <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Circle
                center={[lat, lan]} fillColor="blue" radius={rad}
            />
        
            <Marker
                // position={[this.state.lan,this.state.lat]}
                // position={[this.state.lan,this.state.lat]}
                position={[lat, lan]}
            >
              {createCoodinatesArray(lat, lan, rad)}
            <Popup>
                {[lat, lan]}
            </Popup>

            </Marker>
        

        </MapContainer>
    )
}




function createCoodinatesArray(lat, lan, rad) {
  // console.log('secondary point is '+lat+' '+lan);
  const arraySize = parseInt((2 * rad) / 1.1);
  console.log(rad*2);
  console.log(arraySize);
  // console.log(rad);


  // //In reacl case
  const coordinates = []
  //if arraysize is odd
  //go to top left
  const topLeftLat = lat + (((arraySize/2)-1)*0.00001);
  const topLeftLan = lan - (((arraySize/2)-1)*0.00001);

  /*** */
  //coordinates.push([topLeftLat, topLeftLan])
  //coordinates.push([topLeftLat-0.000005, topLeftLan+0.000005])
/*** */


  for(let row=0; row<arraySize; row++) {
    for(let col=0; col<arraySize; col++) {
      let current;
      current = [topLeftLat-row*0.00001, topLeftLan+col*0.00001]
      // console.log('current is '+current);
      coordinates.push(current)
    }

  }

  console.log(coordinates.length);

  // //to display
  // const coordinates = []
  // //if arraysize is odd
  // //go to top left
  // const topLeftLat = lat - ((arraySize-1)*0.0005);
  // const topLeftLan = lan + ((arraySize-1)*0.0005);

  // for(let row=0; row<arraySize-1; row++) {
  //   for(let col=0; col<arraySize-1; col++) {
  //     let current;
  //     current = [topLeftLat-topLeftLat*row*0.0001, topLeftLan+topLeftLan*col*0.0001]
  //     // console.log('current is '+current);
  //     coordinates.push(current)
  //   }
  // }

  // console.log('here is the cordinates array');
  // console.log(coordinates);

  // const displayMarker = (pos)=>{
  //   console.log('now im going to draw '+ pos);
  //   return(
  //   <Marker
  //     position={pos}>
  //   </Marker>
  // );
  // }

  const test = [[lat-0.0001, lan+0.0001], [lat-0.0002, lan+0.0002]];

  return(
    <div>
      {
        
        coordinates.map((item, index)=>{
          // console.log(index);
          return(
            <div key={index}>
            <Marker
              position={item}>
            </Marker>
          </div>
          )
        })



        // test.forEach(item=>{
        //   console.log(item[0]);
        //   <div key={item[0]}>
        //     <Marker
        //     position={item}>
        //   </Marker>
        //   </div>
        // })
      }
        {/* <div>
        <Marker
          position={test[1]}>
        </Marker>
        </div>
        <div>
        <Marker
          position={test[0]}>
        </Marker>
        </div> */}
    </div>
  )

  // return(
  //   <Marker
  //     position={[lat-0.0001, lan+0.0001]}>
  //   </Marker>
  // );
}






function OpenStreetMap() {

    /************************************ */
    const [searches, setSearches] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchSearches();
  }, []);

  async function fetchSearches() {
    try{
    const apiData = await API.graphql(graphqlOperation(listSearches));
	console.log(apiData)
    setSearches(apiData.data.listSearches.items);
    } catch (err) {
    console.log('error creating todo:', err)
  }
  }

  async function create() {
    
    if (!formData.name) return;
//	setFormData({ ...formData, 'id': formData.SearchLocLoc})
//	formData.id = fromData.SearchLocLoc + formData.name
	console.log(formData)
    await API.graphql({ query: createSearch, variables: { input: formData } });
    setSearches([ ...searches, formData ]);
    setFormData(initialFormState);

  }

  async function deleteS({ id }) {
    const newSearchesArray = searches.filter(search => search.id !== id);
    setSearches(newSearchesArray);
    await API.graphql({ query: deleteSearch, variables: { input: { id } }});
  }

  /******************************* */












    
    const [lan, setLan] = useState(80.2405);
    const [lat, setLat] = useState(6.0513);
    const [area, setArea] = useState(2000);
    const [des, setDes] = useState(0);


    const radius = Math.sqrt(area / Math.PI)

    // const map = useMapEvent('click', () => {
    //         map.setCenter([lan, lat])
    // })

    const [show, setShow] = useState(false);

    const enableMap = ()=>{
        setShow(true)
        console.log(show);
    };

    const disableMap = ()=>{
        setShow(false)
        console.log(show);
    }

    return(


    <div className="App" className="each-slide">

      <h1>My searches App</h1>
      
      <div class="center">
        { show ? CallMap(lat, lan, radius) : null}
      </div>
      
        
      <input
        type="text"
        class="type-2"
        onChange={e => setFormData({ ...formData, 'id': e.target.value})}
        placeholder= "id"
        value={formData.id}
      />
      <br></br>

      <input
        type="text"
        class="type-2"
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="search name"
        value={formData.name}
      />
      <br></br>

      <input
        type="text"
        class="type-2"
        onChange={e => setFormData({ ...formData, 'description': e.target.value})}
        placeholder="search description"
        value={formData.description}
      />
      <br></br>


{/* for map conatiner */}

      {/* 1 - lan
      
          2 - lat
      
      */}




      <input
        type="text"
        class="type-2"
        onChange={e => {
          setFormData({ ...formData, 'searchLon': e.target.value})
          setLan(e.target.value)
        }
      
      }
        placeholder= "searchLan"
        //value={formData.searchLat}
        value={lan}
      />
      <br></br>

      <input
        type="text"
        class="type-2"
        onChange={e => {setFormData({ ...formData, 'searchLat': e.target.value})
        setLat(e.target.value)  
      }}
        placeholder= "searchLat"
        //value={formData.searchLon}
        value={lat}
      />
      {/* ending for map container */}
      <br></br>

      
      <input
        type="text"
        class="type-2"
        onChange={e => setFormData({ ...formData, 'startLon': e.target.value})}
        placeholder= "startLon"
        value={formData.startLon}
      />
      <br></br>

      <input
        type="text"
        class="type-2"
        // onChange={e => setFormData({ ...formData, 'startLon': e.target.value})}
        onChange={e=>setArea(e.target.value)}
        placeholder= "Area"
        value={area}
      />
      <br></br>

      <button onClick={create}>Create search</button>
      <br></br>
      <br></br>
      <button class="button-37"  onClick={enableMap}>View on map</button>
      <button class="button-37"  onClick={disableMap}>Reset</button>
      
      <BrowserRouter>
      <Link to='/proceed'>
        <button class="button-37">Proceed</button>
      </Link>

        <Route path='/proceed' component={Proceed} />
      
        </BrowserRouter>
      


      

      {/* <div style={{marginBottom: 30}}>
        {
          searches.map(search => (
            <div key={search.id || search.name }>
              <h2>{search.name}</h2>
              <p>{search.description}</p>
              <p>{search.searchLat}</p>
              <p>{search.searchLon}</p>
			  <button onClick={() => deleteS(search)}>Delete</button>
            </div>
          ))

        }
      </div> */}
      
      
      

      
        {/* <div class="center" style={{display:'flex', justifyContent:'left'}}>
            <button class="button-37"  onClick={enableMap}>View on map</button>
            <button class="button-37"  onClick={disableMap}>Reset</button>
        </div> */}

            

        {/* { show ? CallMap(lan, lat, radius) : null} */}


      <AmplifySignOut />

      

      

    </div>




















        // // console.log('rerendered');
        // // console.log(this.state.lan);
        // // console.log(this.state.lat);

        


        // // const center = [this.props.lan,this.props.lat]

            
        // //Inputs and buttons
        //     <div>
        //     {console.log(lan)}
            
        //     {console.log(lat)}

        //     <h3>GPS Coordinates</h3>
           
        //     <label for="name">Longitude
        //     <br></br>
        //         <input required type="text" class="type-2" id="xx" onChange={e=>setLan(e.target.value)} value={lan} />
        //     </label>
        //     <br></br>

        //     <label for="name">Latitude
        //     <br></br>
        //         <input required type="text" class="type-2" id="" onChange={e=>setLat(e.target.value)} value={lat} />
        //     </label>
            

        //     <br></br>

        //     <label for="name">Select your robot
        //     <br></br>
        //         <input type="text" class="type-2" id="" placeholder="Robot ID" />
        //     </label>
        //     <br></br>

        //     <label for="name">Please Input the area
        //     <br></br>
        //         <input type="text" class="type-2" id="" placeholder="Area"/>
        //     </label>
            

        //     <br></br>

        //     <br></br>

        //     <div style={{display:'flex', justifyContent:'left'}}>
        //         <button class="button-37"  onClick={enableMap}>View on map</button>
        //         <button class="button-37"  onClick={disableMap}>Reset</button>
        //     </div>

            

        //     { show ? CallMap(lan, lat) : null}

            
            
        // </div>
    )
    
}







export default geolocated({
    positionOptions:{
        enableHighAccuracy:false
    },
    userDecisionTimeout:10000
})(OpenStreetMap);