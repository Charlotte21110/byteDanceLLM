var g=(s,u)=>()=>(u||s((u={exports:{}}).exports,u),u.exports);var t=g((d,e)=>{var e=e||{};function n(s){return{subLanguage:"xml",contains:[s.COMMENT("<!--","-->",{relevance:10}),{begin:/^(\s*)(<script>)/gm,end:/^(\s*)(<\/script>)/gm,subLanguage:"javascript",excludeBegin:!0,excludeEnd:!0},{begin:/^(\s*)(<script lang=["']ts["']>)/gm,end:/^(\s*)(<\/script>)/gm,subLanguage:"typescript",excludeBegin:!0,excludeEnd:!0},{begin:/^(\s*)(<style(\sscoped)?>)/gm,end:/^(\s*)(<\/style>)/gm,subLanguage:"css",excludeBegin:!0,excludeEnd:!0},{begin:/^(\s*)(<style lang=["'](scss|sass)["'](\sscoped)?>)/gm,end:/^(\s*)(<\/style>)/gm,subLanguage:"scss",excludeBegin:!0,excludeEnd:!0},{begin:/^(\s*)(<style lang=["']stylus["'](\sscoped)?>)/gm,end:/^(\s*)(<\/style>)/gm,subLanguage:"stylus",excludeBegin:!0,excludeEnd:!0}]}}e.exports=function(s){s.registerLanguage("vue",n)};e.exports.definer=n});export default t();
