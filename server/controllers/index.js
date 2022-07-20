function getEle(id) {
  return document.getElementById(id);
}

function getListProduct() {
  //pending
  getEle("loading").style.display = "block";
  axios({
    url: "https://62ce76a0486b6ce82645a474.mockapi.io/Products",
    method: "GET",
  })
    .then(function (result) {
      getEle("loading").style.display = "none";
      renderProducts(result.data);
    })
    .catch(function (error) {
      getEle("loading").style.display = "none";
      console.log(error);
    });
}

getListProduct();

function renderProducts(data) {
  let contentHTML = "";

  data.forEach((item, i) => {
    let productImg = item.img.includes("https")
      ? item.img
      : `./../../assets/img/${item.img}`;

    contentHTML += `
        <tr>
            <td>${i + 1}</td>
            <td>${item.name}</td>
            <td>${data[i].price}</td>
            <td>
                <img width="50px" src="${productImg}" alt="${item.name}" />
            </td>
            <td>${item.desc}</td>
            <td>
              <button onclick="deleteProduct('${
                item.id
              }')" class="btn btn-danger">Xoá</button>

              <button onclick="getProduct('${
                item.id
              }')" class="btn btn-info">Cập nhật</button>
            </td>
        </tr>
    `;
  });

  getEle("tblDanhSachSP").innerHTML = contentHTML;
}

function createProduct() {
  let prodName = getEle("name").value;
  let prodPrice = getEle("price").value;
  let prodScreen = getEle("screen").value;
  let prodBackCam = getEle("backCamera").value;
  let prodFrontCam = getEle("frontCamera").value;
  let prodImage = getEle("img").value;
  let prodDescription = getEle("MoTa").value;
  let prodType = getEle("type").value;

  let product = new Product(
    prodName,
    prodPrice,
    prodScreen,
    prodBackCam,
    prodFrontCam,
    prodImage,
    prodDescription,
    prodType
  );

  axios({
    url: "https://62ce76a0486b6ce82645a474.mockapi.io/Products",
    method: "POST",
    data: product,
  })
    .then(function (res) {
      getListProduct();
      getEle("btnCloseModal").click();
    })
    .catch(function (err) {
      console.log(err);
    });

  // GET POST  DELETE PATCH PUT (Restful API)
}

function deleteProduct(id) {
  axios({
    url: "https://62ce76a0486b6ce82645a474.mockapi.io/Products/" + id,
    method: "DELETE",
  })
    .then(function (res) {
      alert("xoá thành công");
      getListProduct();
    })
    .catch(function (err) {
      console.log(err);
    });
}

function getProduct(id) {
  axios({
    url: "https://62ce76a0486b6ce82645a474.mockapi.io/Products/" + id,
    method: "GET",
  })
    .then(function (res) {
      getEle("btnThemSP").click();

      getEle("productId").value = res.data.id;
      getEle("name").value = res.data.name;
      getEle("price").value = res.data.price;
      getEle("screen").value = res.data.screen;
      getEle("backCamera").value = res.data.backCamera;
      getEle("frontCamera").value = res.data.frontCamera;
      getEle("img").value = res.data.img;
      getEle("desc").value = res.data.desc;
      getEle("type").value = res.data.type;

      getEle("btnSaveInfo").style.display = "none";
      getEle("btnUpdate").style.display = "inline";
    })
    .catch(function (err) {
      console.log(err);
    });
}

function updateProduct() {
  let proID = getEle("productId").value
  let prodName = getEle("name").value
  let prodPrice = getEle("price").value
  let prodScreen = getEle("screen").value
  let prodBackCamera = getEle("backCamera").value
  let prodFrontCamera = getEle("frontCamera").value
  let prodImage = getEle("img").value
  let prodDescription = getEle("desc").value
  let prodType = getEle("type").value

  let product = new Product(
    proID,
    prodName,
    prodPrice,
    prodScreen,
    prodBackCamera,
    prodFrontCamera,
    prodImage,
    prodDescription,
    prodType
  )


  axios({
    url: "https://62ce76a0486b6ce82645a474.mockapi.io/Products/" + prodId,
    method: "PUT",
    data: product,
  })
    .then(function (res) {
      document.getElementById("btnUpdate").style.display = "block"
      document.getElementById("btnSaveInfo").style.display = "none"
      getListProduct();
    })
    .catch(function (err) {
      console.log(err);
    });
}
