#pragma once
#include <GL/glew.h>

#include "SDL.h"

#include <iostream>

#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/type_ptr.hpp>

class Light {
public:
	glm::vec3 lightPosition;
	glm::vec3 lightColour;

};