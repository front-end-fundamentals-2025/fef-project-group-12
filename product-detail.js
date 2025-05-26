document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name");
  const price = params.get("price");
  const desc = params.get("desc");

  if (name && price && desc) {
    document.getElementById("product-name").textContent = name;
    document.getElementById("product-price").textContent = price + " SEK";
    document.getElementById("product-description").textContent = desc;
  } else {
    document.getElementById("product-details").innerHTML =
      "<p>Product not found.</p>";
  }
});
