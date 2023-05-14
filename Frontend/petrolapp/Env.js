class Env{
    constructor(url,apikey){
        this.url =url,
        this.apikey=apikey
    }
}

const env = new Env(
    url="http://10.0.2.2:8000",
    apikey="AIzaSyCvrfTdyGEDP_uR4sg8qd6vkIMNK0nnC6A"
    )

export default env