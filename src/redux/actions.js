import axios from 'axios';

 
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    config.headers['content-type'] = 'application/json';
    config.headers['X-Requested-With'] = 'XMLHttpRequest'; 
    let token = localStorage.getItem('accessToken');
    if(token) {
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });
 

axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    // document.location.reload();
    return Promise.reject(error);
});

export const appMessage = (text, status = true, stay = 0) => {
    return showMessage(status ? 'success' : 'error', text, stay);
}

export const metaMessage = (meta, stay = 0) => {
    if (!meta.success && meta.message.toLowerCase().indexOf('need to login') >= 0) {
        setTimeout(function () {
            // document.location.reload();
        }, 5000)
    }
    return appMessage(meta.message, meta.success, stay);
}

export const getAuthUser = () => {
    return (dispatch) => {
        axios.get('/api/v1/auth-user').then((resp) => {
            let data = false;
            if (resp.data.data) {
                data = resp.data.data;
            }
            dispatch({
                type: 'USER_UPDATE',
                data
            })
        });
    }

}

export const updateUser = (data) => {
    return {
        type: 'USER_UPDATE',
        data: data
    }
}

export const loadConfig = () => {
    return (dispatch) => {
        axios.get('/api/v1/config-data').then(resp => {
            createCodeMap(resp.data.data.LocalBodies);
            dispatch(setConfigData(resp.data.data));
        });
    }
}
export const setConfigData = (data) => {
    return {
        type: 'SET_CONFIG_DATA',
        data: data
    }
}

export const showModal = (name, data = null) => {
    return {
        type: "MODAL_UPDATE",
        name: name,
        data: data
    };
}

export const setFilterStats = (data) => {
    return {
        type: "REQUEST_FILTER_STATS",
        data: data
    };
}

export const showMessage = (type, text, stay = 0) => {
    return {
        type: "MESSAGE_STATUS",
        key: 'appMessage',
        value: {
            stay: stay,
            cls: type === 'success' ? 'w3-green' : 'w3-red',
            text,
        },
    };
}

export const setSearch = (text) => {

    return {
        type: 'SEARCH_TEXT',
        value: text
    }
}

export const getLatLng = (item) => {
    let lat = null;
    let lng = null;
    if (item.json && item.json.location) {
        lat = parseFloat("" + item.json.location.lat);
        lng = parseFloat("" + item.json.location.lon);
    } else if (item.latLng && item.latLng.coordinates && item.latLng.coordinates.length == 2) {
        lat = item.latLng.coordinates[0];
        lng = item.latLng.coordinates[1];
    }
    return {
        lat: lat,
        lng: lng
    }
}
const gCodeMap = {};
function getCodeType(code) {
    let type = 'Unknown ' + code;
    if (code[0] == 'D') {
        type = 'District';
    } else if (code[0] == 'M') {
        type = 'Muncipality';
    } else if (code[0] == 'G') {
        type = 'Panchayath'
    } else if (code[0] == 'C') {
        type = 'Corporation'
    } else if (code[0] == 'B') {
        type = 'Block';
    }
    return type;
}
export function createCodeMap(localBodies) {
    localBodies.forEach(dist => {
        gCodeMap[dist.code] = {
            name: dist.name + " " + getCodeType(dist.code)
        }
        for (var code in dist.bodies) {
            gCodeMap[code] = {
                name: dist.bodies[code] + " " + getCodeType(code)
            };
        }
    });
}
export function getBodyName(code) {
    const parts = code.split("-");
    return gCodeMap[parts[0]] || { name: 'Unknown' };
}

export const getLocalBodyOptions = (bodies) => {
    const kvs = [];
    for (var code in bodies) {
        let suffix = 'Panchayath'
        if (code[0] == 'M') {
            suffix = 'Muncipality';
        } else if (code[0] == 'C') {
            suffix = 'Corporation';
        }
        kvs.push({
            value: code,
            label: bodies[code] + "  (" + suffix + ")"
        })
    }
    kvs.sort((a, b) => a.label.localeCompare(b.label));
    return kvs;
}
export const hideMessage = () => {
    return {
        type: "MESSAGE_STATUS",
        key: 'appMessage',
        value: {
            cls: '',
            text: '',
        },
    };
};
