import { extend, configure } from "vee-validate";
import { i18n } from 'vue-lang-router'
import translations from '../lang/translations'
import * as rules from 'vee-validate/dist/rules'
import zh from 'vee-validate/dist/locale/zh_CN.json'
import en from 'vee-validate/dist/locale/en.json'
import ja from 'vee-validate/dist/locale/ja.json'
import fr from 'vee-validate/dist/locale/fr.json'
import de from 'vee-validate/dist/locale/de.json'
import ko from 'vee-validate/dist/locale/ko.json'
import es from 'vee-validate/dist/locale/es.json'
import pt from 'vee-validate/dist/locale/pt_PT.json'
import ru from 'vee-validate/dist/locale/ru.json'

Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule])
});

const v_langs = [ zh, en, ja, fr, de, ko, es, pt, ru ];
Object.keys(translations).forEach(lang => {
  v_langs.forEach(v_lang => {
    if (v_lang.code.startsWith(lang)) {
      translations[lang].messages.validations || (translations[lang].messages.validations = {})
      Object.assign(translations[lang].messages.validations, v_lang.messages)
    }
  })
});

configure({
  defaultMessage: (field, values) => {
    // override the field name.
    values._field_ = i18n.t(field);
    return i18n.t(`validations.${values._rule_}`, values);
  }
});