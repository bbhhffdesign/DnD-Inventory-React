export default function CreateItem({ setInventory, inventory, onClose }) {
  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const item = Object.fromEntries(formData.entries());
    const category = item.category;
    const newItem = {
      ...item,
      weight: parseFloat(item.weight),
      quantity: parseInt(item.quantity, 10),
      value: parseFloat(item.value),
    };

    setInventory({
      [category]: [...(inventory[category] || []), newItem],
    });
    e.target.reset();
    onClose();
  }

  return (
    <form
      className="pure-form pure-form-stacked modal"
      onSubmit={handleSubmit}
      style={{ border: "solid 1px white", padding: "1rem" }}
    >
      <h2 style={{ margin: "0" }}>Crear Item</h2>
      <input name="name" placeholder="Nombre" required />
      <input name="description" placeholder="Descripción" required />
      <input
        name="weight"
        type="number"
        step="0.1"
        placeholder="Peso"
        required
      />
      <input name="quantity" type="number" placeholder="Cantidad" required />
      <input
        name="value"
        type="number"
        step="0.001"
        placeholder="Valor"
        required
      />
      <select name="category">
        <option value="equipment">Equipamiento</option>
        <option value="consumables">Consumibles</option>
        <option value="crafting">Crafteo</option>
        <option value="quest">Misión</option>
        <option value="misc">Misceláneo</option>
      </select>
      <div>
        <button className="pure-button" type="submit">
          Crear
        </button>
        <button className="pure-button" type="button" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
