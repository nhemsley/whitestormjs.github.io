!function(){"use strict";var t=t||{};t.vertexShadersPath="./vertex-shaders",t.fragmentShadersPath="./fragment-shaders",t.assetsPath="./assets",t.log=function(){},t.Composer=function(e,s){this.width=1,this.height=1,this.settings=s||{},this.useRGBA=this.settings.useRGBA||!1,this.renderer=e,this.copyPass=new t.CopyPass(this.settings),this.scene=new THREE.Scene,this.quad=new THREE.Mesh(new THREE.PlaneBufferGeometry(1,1),this.defaultMaterial),this.scene.add(this.quad),this.camera=new THREE.OrthographicCamera(1,1,1,1,-1e4,1e4),this.front=new THREE.WebGLRenderTarget(1,1,{minFilter:void 0!==this.settings.minFilter?this.settings.minFilter:THREE.LinearFilter,magFilter:void 0!==this.settings.magFilter?this.settings.magFilter:THREE.LinearFilter,wrapS:void 0!==this.settings.wrapS?this.settings.wrapS:THREE.ClampToEdgeWrapping,wrapT:void 0!==this.settings.wrapT?this.settings.wrapT:THREE.ClampToEdgeWrapping,format:this.useRGBA?THREE.RGBAFormat:THREE.RGBFormat,type:void 0!==this.settings.type?this.settings.type:THREE.UnsignedByteType,stencilBuffer:void 0!==this.settings.stencilBuffer?this.settings.stencilBuffer:!0}),this.back=this.front.clone(),this.startTime=Date.now(),this.passes={}},t.Composer.prototype.linkPass=function(t,e){function s(e){this.message='Pass "'+t+'" already loaded.',this.name="WagnerLoadPassException",this.toString=function(){return this.message}}if(this.passes[t])throw new s(t,e);this.passes[t]=e},t.Composer.prototype.swapBuffers=function(){this.output=this.write,this.input=this.read;var t=this.write;this.write=this.read,this.read=t},t.Composer.prototype.render=function(t,e,s,a){this.copyPass.isLoaded()&&(s&&this.swapBuffers(),this.renderer.render(t,e,a?a:this.write,!0),a||this.swapBuffers())},t.Composer.prototype.toScreen=function(){this.copyPass.isLoaded()&&(this.quad.material=this.copyPass.shader,this.quad.material.uniforms.tInput.value=this.read,this.quad.material.uniforms.resolution.value.set(this.width,this.height),this.renderer.render(this.scene,this.camera))},t.Composer.prototype.toTexture=function(t){this.copyPass.isLoaded()&&(this.quad.material=this.copyPass.shader,this.quad.material.uniforms.tInput.value=this.read,this.renderer.render(this.scene,this.camera,t,!1))},t.Composer.prototype.pass=function(e){if(e instanceof t.Stack)this.passStack(e);else{if("string"==typeof e&&(this.quad.material=this.passes[e]),e instanceof THREE.ShaderMaterial&&(this.quad.material=e),e instanceof t.Pass){if(!e.isLoaded())return;return void e.run(this)}e.isSim||(this.quad.material.uniforms.tInput.value=this.read),this.quad.material.uniforms.resolution.value.set(this.width,this.height),this.quad.material.uniforms.time.value=.001*(Date.now()-this.startTime),this.renderer.render(this.scene,this.camera,this.write,!1),this.swapBuffers()}},t.Composer.prototype.passStack=function(t){t.getPasses().forEach(function(t){this.pass(t)}.bind(this))},t.Composer.prototype.reset=function(){this.read=this.front,this.write=this.back,this.output=this.write,this.input=this.read},t.Composer.prototype.setSource=function(t){this.copyPass.isLoaded()&&(this.quad.material=this.copyPass.shader,this.quad.material.uniforms.tInput.value=t,this.renderer.render(this.scene,this.camera,this.write,!0),this.swapBuffers())},t.Composer.prototype.setSize=function(t,e){this.width=t,this.height=e,this.camera.projectionMatrix.makeOrthographic(t/-2,t/2,e/2,e/-2,this.camera.near,this.camera.far),this.quad.scale.set(t,e,1),this.front.setSize(t,e),this.back.setSize(t,e)},t.Composer.prototype.defaultMaterial=new THREE.MeshBasicMaterial,t.loadShader=function(t,e){var s=new XMLHttpRequest;s.onload=function(){var t=s.responseText;e(t)}.bind(this),s.onerror=function(){function e(t){this.message='Shader "'+t+"\" couldn't be loaded.",this.name="WagnerLoadShaderException",this.toString=function(){return this.message}}throw new e(t)},s.onabort=function(){function e(t){this.message='Shader "'+t+'" load was aborted.',this.name="WagnerLoadShaderException",this.toString=function(){return this.message}}throw new e(t)},s.open("get",t,!0),s.send()},t.processShader=function(e,s){t.log("Processing Shader | Performing uniform Reflection...");for(var a,i,r,n,o=/uniform\s+([^\s]+)\s+([^\s]+)\s*;/gi,h=/uniform\s+([^\s]+)\s+([^\s]+)\s*\[\s*(\w+)\s*\]*\s*;/gi,u={sampler2D:{type:"t",value:function(){return new THREE.Texture}},samplerCube:{type:"t",value:function(){}},bool:{type:"b",value:function(){return 0}},"int":{type:"i",value:function(){return 0}},"float":{type:"f",value:function(){return 0}},vec2:{type:"v2",value:function(){return new THREE.Vector2}},vec3:{type:"v3",value:function(){return new THREE.Vector3}},vec4:{type:"v4",value:function(){return new THREE.Vector4}},bvec2:{type:"v2",value:function(){return new THREE.Vector2}},bvec3:{type:"v3",value:function(){return new THREE.Vector3}},bvec4:{type:"v4",value:function(){return new THREE.Vector4}},ivec2:{type:"v2",value:function(){return new THREE.Vector2}},ivec3:{type:"v3",value:function(){return new THREE.Vector3}},ivec4:{type:"v4",value:function(){return new THREE.Vector4}},mat2:{type:"v2",value:function(){return new THREE.Matrix2}},mat3:{type:"v3",value:function(){return new THREE.Matrix3}},mat4:{type:"v4",value:function(){return new THREE.Matrix4}}},p={"float":{type:"fv",value:function(){return[]}},vec3:{type:"v3v",value:function(){return[]}}},d={resolution:{type:"v2",value:new THREE.Vector2(1,1),"default":!0},time:{type:"f",value:Date.now(),"default":!0},tInput:{type:"t",value:new THREE.Texture,"default":!0}};null!==(a=o.exec(s));)a.index===o.lastIndex&&o.lastIndex++,i=a[1],r=a[2],t.log("  > SINGLE",i,r),d[r]={type:u[i].type,value:u[i].value()};for(;null!==(a=h.exec(s));)a.index===o.lastIndex&&o.lastIndex++,i=a[1],r=a[2],n=a[3],t.log("  > ARRAY",n,i,r),d[r]={type:p[i].type,value:p[i].value()};t.log("Uniform reflection completed. Compiling...");var c=new THREE.ShaderMaterial({uniforms:d,vertexShader:e,fragmentShader:s,shading:THREE.FlatShading,depthWrite:!1,depthTest:!1,transparent:!0});return t.log("Compiled"),c},t.Pass=function(){t.log("Pass constructor"),this.shader=null,this.loaded=null,this.params={},this.isSim=!1},t.Pass.prototype.loadShader=function(e,s){var a=this,i="varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }";t.loadShader(t.fragmentShadersPath+"/"+e,function(e){a.shader=t.processShader(i,e),s&&s.apply(a)})},t.Pass.prototype.mapUniforms=function(t){var e=this.params;for(var s in t)t[s]["default"]||!function(s){Object.defineProperty(e,s,{get:function(){return t[s].value},set:function(e){t[s].value=e},configurable:!1})}(s)},t.Pass.prototype.run=function(t){t.pass(this.shader)},t.Pass.prototype.isLoaded=function(){return null!==this.loaded?this.loaded:void(this.shader instanceof THREE.ShaderMaterial&&(this.loaded=!0))},t.Pass.prototype.getOfflineTexture=function(t,e,s){var a=new THREE.WebGLRenderTarget(t,e,{minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,format:s?THREE.RGBAFormat:THREE.RGBFormat});return a},t.CopyPass=function(){t.Pass.call(this),t.log("CopyPass constructor"),this.loadShader("copy-fs.glsl")},t.CopyPass.prototype=Object.create(t.Pass.prototype),t.GenericPass=function(e,s){t.Pass.call(this);var a=this;t.loadShader(t.vertexShadersPath+"/orto-vs.glsl",function(i){t.loadShader(e,function(e){a.shader=t.processShader(i,e),s&&s.apply(a)})})},t.GenericPass.prototype=Object.create(t.Pass.prototype),t.Stack=function(t){this.passItems=[],this.shadersPool=t,this.passes=[]},t.Stack.prototype.addPass=function(t,e,s,a){var i,r={shaderName:t,enabled:e||!1,params:s};return this.passItems.push(r),i=this.passItems.length,this.updatePasses(),a?this.movePassToIndex(this.passItems[i],a):i-1},t.Stack.prototype.removePass=function(t){this.passItems.splice(t,1),this.updatePasses()},t.Stack.prototype.enablePass=function(t){this.passItems[t].enabled=!0,this.updatePasses()},t.Stack.prototype.disablePass=function(t){this.passItems[t].enabled=!1,this.updatePasses()},t.Stack.prototype.isPassEnabled=function(t){return this.passItems[t].enabled},t.Stack.prototype.movePassToIndex=function(t,e){return this.passItems.splice(e,0,this.passItems.splice(t,1)[0]),this.updatePasses(),e},t.Stack.prototype.reverse=function(){this.passItems.reverse(),this.updatePasses()},t.Stack.prototype.updatePasses=function(){this.passes=this.shadersPool.getPasses(this.passItems),this.passItems.forEach(function(t,e){void 0===t.params&&(t.params=JSON.parse(JSON.stringify(this.passes[e].params)))}.bind(this))},t.Stack.prototype.getPasses=function(){return this.passes},t.ShadersPool=function(){this.availableShaders=[]},t.ShadersPool.prototype.getPasses=function(t){var e,s=[];return this.availableShaders.forEach(function(t){t.used=!1}),t&&t.forEach(function(t,a){t.enabled&&(e=this.getShaderFromPool(t.shaderName,t.params),t.params&&(e.params=this.extendParams(e.params,t.params)),s.push(e))}.bind(this)),s},t.ShadersPool.prototype.getShaderFromPool=function(e,s){var a,i;if(e&&t[e]){for(var r=this.availableShaders.length-1;r>=0;r--)if(i=this.availableShaders[r],!i.used&&i.name===e){i.used=!0,a=i.pass;break}return a||(a=new t[e](s),i={pass:a,name:e,used:!0},this.availableShaders.push(i)),a}},t.ShadersPool.prototype.extendParams=function(t,e){for(var s,a={},i=0,r=arguments.length;r>i;i++)for(s in arguments[i])arguments[i].hasOwnProperty(s)&&(a[s]=arguments[i][s]);return a},window.WAGNER=t}();