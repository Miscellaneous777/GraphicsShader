#version 440 core
out vec4 vertColour;	//output colour of vertex
in vec2 textureCoordinate; //tex coords from vertex shader
in vec3 normals;
in vec3 fragmentPosition;
in vec3 lightColour;
in vec3 lightPosition;
in vec3 viewPosition;
in float time;

uniform sampler2D aTex;		//uniform holding texture info from main programme
uniform sampler2D TopTex;  	//uniform for holding topmost layer
uniform sampler2D NoiseTex; //uniform for holding noise mask
uniform sampler2D BurnTex;  //uniform for holding burn mask


void main()
{
	//ambient component
	//********************************
	//set the ambient coeff from material
	float lightAmbientStrength = 0.3f;
	vec3 objectAmbientReflectionCoeff = vec3(1.0f, 1.0f, 1.0f);
	vec3 ambient = (lightAmbientStrength * objectAmbientReflectionCoeff) * lightColour;
	
	//diffuse component
	//********************************
	//normalise normal vectors (reset them as unit vectors)
	vec3 nNormal = normalize(normals);
	//calculate the light direction from the light position and the fragment position
    vec3 lightDirection = normalize(lightPosition - fragmentPosition);
	
	//determine the dot product of normal direction and light direction
	float diffuseStrength = max(dot(nNormal, lightDirection), 0.0f);
	
	//combine this with the light colour
	//set the diffuse coeff from material
	vec3 objectDiffuseReflectionCoeff = vec3(1.0f, 1.0f, 1.0f);
    vec3 diffuse = (diffuseStrength * objectDiffuseReflectionCoeff) * lightColour;
	
	//specular component
	//**********************************
	float specularStrength = 0.3f;
	vec3 viewDirection = normalize(viewPosition - fragmentPosition);
    vec3 reflectDirection = reflect(-lightDirection, nNormal); 
	float sp = pow(max(dot(viewDirection, reflectDirection), 0.0), 8);
    vec3 specular = specularStrength * sp * lightColour; 

	// Read the RGBA value at the given coord from the texture
	//vec4 textureColour = texture(aTex, textureCoordinate);
	vec4 earthtextureColour = texture(aTex, textureCoordinate);
	vec4 topTexColour = texture(TopTex, textureCoordinate);
	vec4 noiseColour = texture(NoiseTex, textureCoordinate);
	//vec4 burnColour = texture(BurnTex, textureCoordinate);
	float timevalue = pow((cos(time/1000.0)+1)*1.3, 5); // Use cos to fluctate value as time passes, and use power to scale more to the extremes to make the transition faster. 
	// simplest lerp

	//vec4 shiny = texture(NoiseTex, textureCoordinate);

	float dissolveValue = min(pow(noiseColour.r, timevalue), 1.0);

	float burnValue = (2 * dissolveValue + noiseColour.r) - 1.0;

	vec4 burnFinal = texture(BurnTex, vec2(burnValue , 0.5));

	//vec4 burnFinal = vec4(0.7, 0.1, 0.7, 1.0);

	// Mix the two texures, and the amount of mix is defined by the red channel on the noise texture, set to the power of the current clamped cos(time), with a min value of 0.9 to clamp the mix. 

	vec4 textureColour = mix(earthtextureColour, mix(burnFinal, topTexColour, dissolveValue), dissolveValue);
	//textureColour = mix(textureColour, burnFinal, dissolveValue);
	//vec4 finalColour = mix(textureColour, burnColour, dissolveValue/2);
	//float noisemask = pow(noiseColour.r+0.5, 3.0);
	//textureColour = vec4(noisemask,noisemask,noisemask,1.0);

	//vec4 noiseTexColour = texture(NoiseTex, textureCoordinate);
	//textureColour.r = 1.0;
	//textureColour.g = 1.0;
	//textureColour.b = 1.0;
	//textureColour = topTexColour;
	//textureColour.r = 0;
	//textureColour.g = 0;
	//textureColour.b = 0.5;

	//textureColour = noiseTexColour;
	
	//apply no lighting, ambient and diffuse components with colour contributed by texture
	//vertColour = (textureColour);
	//vertColour = textureColour;
	//vertColour = (vec4((lightColour), 1.0) * textureColour);
	//vertColour = (vec4((ambient),1.0) * textureColour);
	//vertColour = (vec4((ambient+diffuse),1.0) * textureColour);
	vertColour = (vec4((ambient+diffuse+specular),1.0)* textureColour);
	
	
}