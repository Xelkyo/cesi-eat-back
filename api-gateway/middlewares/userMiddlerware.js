const nameurl = registry.services[req.params.apiName].url

fetch(nameurl + req.params.path, requestOption)
    .then((response) => {
        return response.json()
    })
    .then((data) => {
        res.send(data.msg)
    })
    .catch((error) => {
        console.error(error)
        res.status(500).send('Internal Server Error')
    })