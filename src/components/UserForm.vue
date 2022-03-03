<template>
    <div class="card-form-user">
      <div class="card-list" style="padding-left: 23%">
        <img src="../assets/images/perfil2.png" width="70%">
      </div>
      <div class="card-form-user__inner">
      <div class="card-input">
        <label for="cardName" class="card-input__label">Nombres</label>
        <input
          type="text"
          class="card-input__input"
          autocomplete="off"
        />
      </div>
      <div class="card-input">
        <label for="cardNumber" class="card-input__label">Apellidos</label>
        <input
          type="tel"
          class="card-input__input"
          autocomplete="off"
        />
      </div>
      <div class="card-form__row">
        <div class="card-form__col">
          <div class="card-form__group">
            <label for="cardMonth" class="card-input__label">Tipo</label>
            <select
              class="card-input__input -select"
            >
              <option value disabled selected>Tipo</option>
              <option
                value="C.C"
              >C.C</option>
            </select>
          </div>
        </div>
        <div class="card-form__col">
          <div class="card-input">
            <label for="cardCvv" class="card-input__label">Número de documento</label>
            <input
              type="tel"
              class="card-input__input"
              maxlength="10"
              autocomplete="off"
            />
          </div>
        </div>
      </div>
      <div class="card-input">
        <label for="cardNumber" class="card-input__label">Telefono</label>
        <input
          type="tel"
          class="card-input__input"
          autocomplete="off"
        />
      </div>
      <button class="card-form__button">Create</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'UserForm'
}
</script>
