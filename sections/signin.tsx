interface Props {
  /**
   * @description The text displayed when the login is successful.
   */
  successText?: string;
  /**
   * @description The user ID label text.
   */
  userIdLabel?: string;
  /**
   * @description The user full name label text.
   */
  userFullNameLabel?: string;
}

export default function LoginForm({ 
  formPromptText = "Conecte-se com seu email e senha e tenha acesso a todos os benefícios que podemos oferecer!",
  emailLabel = "Email",
  passwordLabel = "Senha",
  loginButtonText = "Entrar",
  imageSrc = "https://example.com/login-image.jpg",
  imageAlt = "Login Image",
  successText = "Login realizado com sucesso!",
  userIdLabel = "ID do Usuário",
  userFullNameLabel = "Nome Completo"
}: Props) {
  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;
    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/xml");
    myHeaders.append("SOAPAction", "login");
    myHeaders.append("charset", "UTF-8");
    myHeaders.append("Accept", "text/xml");
    myHeaders.append("organizationId", "00D880000019pSX");
    myHeaders.append("portalId", "0ZEIa00000001bZOAQ");

    const raw = `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n` +
      `<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"urn:partner.soap.sforce.com\">\n` +
      `  <SOAP-ENV:Header>\n` +
      `    <ns1:LoginScopeHeader>\n` +
      `      <ns1:organizationId>00D880000019pSXEAY</ns1:organizationId>\n` +
      `    </ns1:LoginScopeHeader>\n` +
      `  </SOAP-ENV:Header>\n` +
      `  <SOAP-ENV:Body>\n` +
      `    <ns1:login>\n` +
      `      <ns1:username>${email}</ns1:username>\n` +
      `      <ns1:password>${password}</ns1:password>\n` +
      `    </ns1:login>\n` +
      `  </SOAP-ENV:Body>\n` +
      `</SOAP-ENV:Envelope>`;

    try {
      const response = await fetch('https://grupoafya2020--afyasbqa.sandbox.my.site.com/services/Soap/u/57.0', {
        method: 'POST',
        headers: myHeaders,
        body: raw,
      });

      if (response.ok) {
        const data = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "text/xml");
        const userId = xmlDoc.getElementsByTagName("userId")[0].childNodes[0].nodeValue;
        const userFullName = xmlDoc.getElementsByTagName("userFullName")[0].childNodes[0].nodeValue;
        
        return (
          <div class="flex flex-col items-center justify-center mx-auto max-w-4xl">
            <p class="text-2xl text-center mb-6">{successText}</p>
            <p class="text-xl mb-2">{userIdLabel}: {userId}</p>
            <p class="text-xl">{userFullNameLabel}: {userFullName}</p>
          </div>
        );
      } else {
        alert('Login falhou. Verifique seu email e senha.');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Ocorreu um erro ao fazer login. Tente novamente mais tarde.');
    }
  };

  return (
    <div class="flex flex-col md:flex-row items-center justify-center mx-auto max-w-4xl">
      <div class="w-full md:w-1/2">
        <img src={imageSrc} alt={imageAlt} class="w-full h-auto object-cover rounded-md shadow-md" />
      </div>
      <div class="w-full md:w-1/2 md:ml-8 mt-8 md:mt-0">
        <p class="text-xl text-center md:text-left mb-6">{formPromptText}</p>
        <form onSubmit={handleSubmit}>
          <div class="mb-4">
            <label for="email" class="block text-gray-700 text-sm font-bold mb-2">{emailLabel}</label>
            <input type="email" id="email" name="email" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" required />
          </div>
          <div class="mb-6">
            <label for="password" class="block text-gray-700 text-sm font-bold mb-2">{passwordLabel}</label>
            <input type="password" id="password" name="password" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" required />
          </div>
          <div>
            <button type="submit" class="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline">{loginButtonText}</button>
          </div>
        </form>
      </div>
    </div>
  );
}