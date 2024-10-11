<template>
  <BackupCreateTypeCustom ref="childFormRef" v-if="formStore.getPreviousContent()?.type === 'custom'"/>
  <BackupCreateTypeTemplate ref="childFormRef" v-if="formStore.getPreviousContent()?.type === 'template'"/>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {useFormStore} from "@velero-ui-app/stores/form.store";
import BackupCreateTypeCustom from "@velero-ui-app/components/Backup/forms/BackupCreateTypeCustom.vue";
import BackupCreateTypeTemplate from "@velero-ui-app/components/Backup/forms/BackupCreateTypeTemplate.vue";

const formStore = useFormStore();

const childFormRef = ref();

const validate = () => childFormRef.value.validate();
const getForm = () => childFormRef.value.getForm();


defineExpose({
  validate,
  getForm,
});
</script>
